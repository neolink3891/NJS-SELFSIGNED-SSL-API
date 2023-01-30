import MessagesController from "./MessagesController.js";
import MessageController from "./MessageController.js";

export default class TeamsRoute {
    static configRoutes(router) {
        router.route('/messages').post(MessagesController.getLocalMessages);

        router
            .route('/messages/action')
            .post(MessageController.addNewMessage)
            .put(MessageController.updateMessage)
            .delete(MessageController.ssuppressMessage);

        return router;
    }
}