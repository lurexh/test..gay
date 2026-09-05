import http from "node:http";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const PORT = Number(process.env.PORT || 10000);
const HOST = "0.0.0.0";

const server = http.createServer((req, res) => {
    const url = req.url || "/";

    if (url === "/" || url === "/health") {
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        });

        res.end(JSON.stringify({
            status: "ok",
            service: "copium-wisp"
        }));

        return;
    }

    res.writeHead(404, {
        "Content-Type": "text/plain"
    });

    res.end("Not Found");
});


server.on("upgrade", (req, socket, head) => {
    const url = req.url || "";

    if (
        url === "/wisp" ||
        url.startsWith("/wisp/")
    ) {
        try {
            wisp.routeRequest(
                req,
                socket,
                head
            );
        } catch (error) {
            console.error(
                "Wisp WebSocket error:",
                error
            );

            try {
                socket.destroy();
            } catch {}
        }

        return;
    }

    socket.destroy();
});


server.listen(
    PORT,
    HOST,
    () => {
        console.log(
            `Copium Wisp listening on ${HOST}:${PORT}`
        );

        console.log(
            `Health: http://localhost:${PORT}/health`
        );

        console.log(
            `Wisp: ws://localhost:${PORT}/wisp/`
        );
    }
);
