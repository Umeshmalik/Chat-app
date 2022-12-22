import { useContext } from "react";
import { Card, Input, Text, Table, useAsyncList } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import api from "lib/api";

const App = () => {
    const columns = [ { name: "Name", uid: "name" } ];
    const navigate = useNavigate();
    
    const load = async ({ signal, cursor, filterText }) => {
        const { data } = await api({ url: cursor || `/api/user/list?search=${filterText}&page=1`, signal })
        return {
            items: data.results,
            cursor: data.next,
        };
    }
    const list = useAsyncList({ load });

    const onSearch = (event) => {
        const value = event?.target?.value;
        list.setFilterText(value);
    }

    return <div className="mt-6 mx-3 flex items-center flex-col">
        <Card className="my-5 max-w-4xl">
            <Card.Header css={{ justifyContent: "center" }}>
                <Text h1 size={40} css={{ textGradient: "45deg, $blue600 -20%, $pink600 50%" }} weight="bold">
                    Search Peoples
                </Text>
            </Card.Header>
            <Card.Body css={{ alignItems: "center" }}>
                <Input name="search" width={300} aria-label="search" placeholder="Search..." className="mb-7" onChange={onSearch} />
                <Table
                    aria-label="Peoples"
                    css={{ height: "calc($space$14 * 10)", width: "300px" }}
                    color="secondary"
                >
                    <Table.Header columns={columns}>
                        {(column) => (
                            <Table.Column key={column.uid}>{column.name}</Table.Column>
                        )}
                    </Table.Header>
                    <Table.Body
                        items={list.items}
                        loadingState={list.loadingState}
                        onLoadMore={list.loadMore}
                    >
                        {(item) => (
                            <Table.Row key={item.name}>
                                {(key) => <Table.Cell >
                                    <Text className="w-full cursor-pointer font-bold hover:text-blue-500" onClick={() => navigate(`/chat/${item._id}`)}>
                                        {item[key]}
                                    </Text>
                                </Table.Cell>}
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </Card.Body>
        </Card>
    </div>
}

export default App;