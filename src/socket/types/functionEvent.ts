import { Socket } from "net";

type FunctionEvent = (socket: Socket, data: any) => void;

export default FunctionEvent;