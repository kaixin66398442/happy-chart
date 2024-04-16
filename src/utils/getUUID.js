// 生成uuid
import { v4 as uuidv4 } from 'uuid';
export default function getUUID() {
    const uuid = uuidv4();
    return uuid;
}