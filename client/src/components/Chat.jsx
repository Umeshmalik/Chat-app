import { useState, useEffect, useContext, useRef } from "react";
import { Card, Input, Text, Grid, Loading, useAsyncList } from "@nextui-org/react";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";

import { SendButton, SendIcon } from "../../lib/SendIcons";
import { UserContext } from "../context/userContext";
import api from "../../lib/api";
import { getSortedList } from "../../lib/getSorted";

const endpoint = import.meta.env.VITE_SERVER_ENDPOINT;

const Chat = () => {
    const { userId = "" } = useParams();
    let url = {
        curr: `/api/message?page=1&userId=${userId}`,
        prev: null,
        next: null
    };
    let messageArr = [];
    const socket = io(endpoint, { transports: ["websocket", "polling"] });
    const navigate = useNavigate();
    const { user = null } = useContext(UserContext);
    const [to, setTo] = useState("");
    const messageRef = useRef(null);
    const lastRef = useRef(null);
    const grid = useRef(null);

    const load = async ({ signal }) => {
        const { data } = await api({ url: url?.curr , signal });
        url = {curr: data.next, next: null, prev: url.curr};
        messageArr = getSortedList(messageArr, data?.results)
        return {
            items: messageArr
        };
    }
    const list = useAsyncList({ load });

    useEffect(() => {
        messageRef?.current?.focus();
        grid?.current?.addEventListener('scroll', handleScroll);
        return () => grid?.current?.removeEventListener('scroll', handleScroll);
    }, []);

    function handleScroll() {
        if (grid.current.scrollTop > 100) {
            return;
        }
        if(url.curr != url.next){
            list.setFilterText();
        }
    }

    useEffect(() => {
        socket.on('connect', () => {
            getTo();
            console.log('Connected to the server');
        });
        socket.emit("online", user);
        
        socket.on("message out", (msg) => {
            list.setFilterText();
        })
        socket.on("connect_error", () => {
            socket.io.opts.transports = ["polling", "websocket"];
          });
        lastRef.current.scrollIntoView({ behavior: 'auto', block: "end" });
        messageRef?.current?.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                sendMsg()
            }
        })
        return () => {
            socket.emit("offline", user);
            messageRef?.current?.removeEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    sendMsg()
                }
            })
        }
    }, [list]);

    const getTo = async () => {
        await api({ url: `/api/user?id=${userId}` }).then(res => {
            const { data } = res;
            if (data?.user?.name) {
                setTo(data?.user?.name);
            } else {
                navigate("/");
            }
        }).catch(() => {
            navigate("/");
        })
    }

    const sendMsg = () => {
        const message = messageRef.current.value;
        if (message.trim() === "") return;
        socket.emit("message in", { message, ...user, from: user._id, to: userId });
        messageRef.current.value = "";
    }

    return <div className="p-4">
        <Card css={{ padding: "$5", height: "80vh" }}>
            <Card.Header>
                <Text h1 size={40} css={{ textGradient: "45deg, $blue600 -20%, $pink600 50%" }} weight="bold">
                    {to ? to : <Loading type="spinner" color="currentColor" size="sm" />}
                </Text>
            </Card.Header>
            <Card.Body ref={grid}>
                <Grid.Container gap={3} md={12} sm={12} className="flex-col">
                    {list?.items?.map((it, idx) => <Grid className={`p-3 md:w-1/2 ${userId !== it.from ? "self-end" : ""}`} key={idx}>
                        <Card>
                            <Card.Header css={{ paddingBottom: 0 }}>
                                <Text h5 css={{ textGradient: `45deg, ${userId !== it.from ? "$blue600" : "$pink600"} -20%, ${userId === it.from ? "$blue600" : "$pink600"} 50%` }} weight="bold">
                                    {userId !== it.from ? user?.name : to}
                                </Text>
                            </Card.Header>
                            <Card.Body css={{ paddingTop: 0 }}>
                                <Text>{it?.message}</Text>
                            </Card.Body>
                        </Card>
                    </Grid>
                    )}
                    <div ref={lastRef}></div>
                </Grid.Container>
            </Card.Body>
        </Card>
        <div className="fixed bottom-3">
            <div className="rounded-lg flex justify-center w-screen">
                <Input
                    ref={messageRef}
                    size="xl"
                    css={{ width: "90vw" }}
                    aria-label="message"
                    placeholder="Type your message..."
                    contentRightStyling={false}
                    contentRight={
                        <SendButton onClick={sendMsg}>
                            <SendIcon />
                        </SendButton>
                    }
                />
            </div>
        </div>
    </div>
}

export default Chat;