const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");
const authMiddleware = require("../middlewares/auth");
const adminAuth = require("../middlewares/admin");
const combinedAuth = require("../middlewares/combinedAuth");
const WebSocket = require("ws");

router.get("/", authMiddleware, deviceController.getDevices);
router.post("/create", adminAuth, deviceController.createDevice);
router.delete("/delete/:deviceId", adminAuth, deviceController.deleteDevice);
router.put(
  "/set-alarm-triggered-on/:hwId",
  authMiddleware,
  deviceController.setAlarmTriggeredOnByHwId
);
router.put(
  "/set-alarm-triggered-off/:hwId",
  authMiddleware,
  deviceController.setAlarmTriggeredOffByHwId
);

const setupDeviceWebSocket = (wss) => {
  wss.on("connection", (ws, req) => {
    const token = req.headers["sec-websocket-protocol"];

    if (!token) {
      ws.send(
        JSON.stringify({
          success: false,
          message: "Access denied. Token is missing.",
        })
      );
      return ws.close();
    }

    const fakeReq = {
      header: () => `Bearer ${token}`,
      headers: { authorization: `Bearer ${token}` },
    };
    const fakeRes = {
      status: () => fakeRes,
      json: (data) => {
        ws.send(JSON.stringify(data));
        ws.close();
      },
    };

    combinedAuth(fakeReq, fakeRes, () => {
      if (!fakeReq.user) return;

      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message);

          if (!data.householdId || !data.action) {
            return ws.send(
              JSON.stringify({
                success: false,
                message: "Missing required fields",
              })
            );
          }

          const controllerReq = {
            body: { householdId: data.householdId },
            user: fakeReq.user,
            userType: fakeReq.userType,
          };

          if (data.action === "setStateActive") {
            await deviceController.setStateActive(ws, controllerReq);
          } else if (data.action === "setStateDeactive") {
            await deviceController.setStateDeactive(ws, controllerReq);
          } else {
            ws.send(
              JSON.stringify({
                success: false,
                message: "Invalid action",
              })
            );
          }
        } catch (error) {
          ws.send(
            JSON.stringify({
              success: false,
              message: error.message,
            })
          );
        }
      });
    });
  });
};
module.exports = {
  router,
  setupDeviceWebSocket,
};
