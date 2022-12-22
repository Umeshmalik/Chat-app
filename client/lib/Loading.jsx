import { Badge } from "@nextui-org/react";

const Skelton = () => <div className="flex animate-pulse flex-row items-center h-full justify-center space-x-5">
    <div className="w-12 bg-gray-300 h-12 rounded-full ">
    </div>
    <div className="flex flex-col space-y-3">
        <div className="w-36 bg-gray-300 h-6 rounded-md ">
        </div>
        <div className="w-24 bg-gray-300 h-6 rounded-md ">
        </div>
    </div>
</div>

const Loading = ({ overlay = "None" }) => {
    const arr = Array.from({ length: 3 })
    return <div className="w-4/5 h-56 border-2 rounded-md mx-auto my-10 flex justify-evenly">
        <Badge
            content= {overlay}
            color="secondary"
            css={{ backgroundColor: "transparent", zoom: "1.5", color: "cadetblue", borderColor: "cadetblue", display: overlay }}
            horizontalOffset="45%"
            verticalOffset="45%"
        >
            {arr.map((_, idx) => <Skelton key={idx}/>)}
        </Badge>
    </div >
}

export default Loading;