"use client";

import { useSession } from "next-auth/react";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { setCookie } from "../../lib/cookies";

export default function GoogleSuccessPage() {

  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {

    const loginWithBackend = async () => {

      if (!session?.user) return;

      try {

        const res = await fetch(

          `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,

          {

            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({

              name: session.user.name,

              email: session.user.email,

              image: session.user.image,

            }),

          }

        );

        const data = await res.json();

        // SET YOUR EXISTING JWT TOKEN
        setCookie(

          "token",

          data.token,

          {
            maxAge: 60 * 60 * 24 * 7,
          }

        );

        router.push("/");

      } catch (err) {

        console.log(err);

      }

    };

    loginWithBackend();

  }, [session]);

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      Logging you in...

    </div>

  );

}