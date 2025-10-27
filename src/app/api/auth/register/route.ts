import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(request: Request) {
  /*const bcrypt = require('bcrypt');
    try {
        const { firstname, lastname, email, password } = await request.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.user.create({
            data: {
                firstname: firstname,
                lastname: lastname,
                email: email,
                passwordHash: hashedPassword,
            },
        });
    } catch (e) {
        console.log({ e });
    }

    return NextResponse.json({ message: "success" });*/
}
