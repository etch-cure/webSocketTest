// 출처: https://curryyou.tistory.com/348

const path = require("path");

// HTTP 서버(express) 생성 및 구동
// 1. express 객체 생성
const express = require('express');
const app = express();
// 2. "/" 경로 라우팅 처리
app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, './index.html')); // index.html 파일 응답 })
});
// index.html 파일 응답
// 3. 30001 port에서 서버 구동
const HTTPServer = app.listen(30001, () => { console.log("Server is open at port:30001"); });

const wsModule = require('ws');

const webSocketServer = new wsModule.Server({ server: HTTPServer, });

const connectingWS = []

webSocketServer.on('connection', (ws, request) => {
    // 1) 연결 클라이언트 IP 취득
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    console.log(`새로운 클라이언트[${ip}] 접속`);
    // 2) 클라이언트에게 메시지 전송
    if (ws.readyState === ws.OPEN) {
        // 연결 여부 체크
        ws.send(`클라이언트[${ip}] 접속을 환영합니다 from 서버`);
    }
    connectingWS.push(ws)
    // 3) 클라이언트로부터 메시지 수신 이벤트 처리
    ws.on('message', (msg) => {
        console.log(`현재 활성화된 ws 갯수: ${connectingWS.length}`)
        console.log(`클라이언트[${ip}]에게 수신한 메시지 : ${msg}`);
        // ws.send('메시지 잘 받았습니다! from 서버');
        connectingWS.forEach((item) => item.send('메시지 뿌리기 : ' + msg))
    })
    // 4) 에러 처러
    ws.on('error', (error) => {
        console.log(`클라이언트[${ip}] 연결 에러발생 : ${error}`);
    })
    // 5) 연결 종료 이벤트 처리
    ws.on('close', () => {
        const curWsIndex = connectingWS.findIndex((item) => item === ws)
        if(curWsIndex !== -1) {
            connectingWS.splice(curWsIndex, 1)
        }
        console.log(`클라이언트[${ip}] 웹소켓 연결 종료`);
    })
});
