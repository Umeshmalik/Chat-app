import { useState, useEffect, useContext, useRef } from "react";
import { Card, Input, Text, Grid, Loading } from "@nextui-org/react";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";

import { SendButton, SendIcon } from "../../lib/SendIcons";
import { UserContext } from "../context/userContext";
import api from "../../lib/api";

const endpoint = import.meta.env.VITE_SERVER_ENDPOINT;
const socket = io(endpoint);

const Chat = () => {
    const { userId = "" } = useParams();
    const navigate = useNavigate();
    const { user = null } = useContext(UserContext);
    const [to, setTo] = useState("");
    const messageRef = useRef(null);
    const lastRef = useRef(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getTo();
        getMessages();
    }, [])

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to the server');
        });
        socket.emit("online", user);

        socket.on("message out", (msg) => {
            getMessages();
        })
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
    }, []);

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

    const getMessages = async () => {
        await api({ url: `/api/message?page=${1}` }).then(res => {
            const { data } = res;
            const { results = [] } = data;
            setMessages(results);
            lastRef.current.scrollIntoView({ behavior: 'smooth', block: "end" });
        })
    }

    const sendMsg = () => {
        const message = messageRef.current.value;
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
            <Card.Body>
                <Grid.Container gap={3} md={12} sm={12} className="flex-col-reverse">
                    <div ref={lastRef}></div>
                    {messages.map((it, idx) => <Grid className={`p-3 w-1/2 ${userId !== it.from ? "self-end" : ""}`} key={idx}>
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