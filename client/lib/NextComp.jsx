import { Input } from "@nextui-org/react";

const NextInput = ({type, props}) => type === "password" ? <Input.Password css={{marginBottom: props?.helperText ? "$10" : "$1"}} placeholder="start typing..." clearable {...props} type={type} /> : <Input css={{marginBottom: props?.helperText ? "$10" : "$1"}} placeholder="start typing..." clearable {...props} type={type}/>

export {
    NextInput
}