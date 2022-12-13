import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

type Token = JWTPayload

export async function sign(payload: Token, secret: string): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 720000;

    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret));
}

export async function verify(token: string, secret: string): Promise<Token> {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    // run some checks on the returned payload, perhaps you expect some specific values

    // if its all good, return it, or perhaps just return a boolean
    return payload;
}