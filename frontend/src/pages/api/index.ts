import type {NextApiRequest, NextApiResponse} from 'next'
import {remoteURL} from "@/consts/fetchURLS";

type Data = {
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    res.redirect(302, remoteURL)
}
