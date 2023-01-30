import MessageDAO from '../dao/MessageDAO.js';

export default class MessageController {
    static async  addNewMessage(req, res, next) {
        try {
            const created = new Date().toISOString().substring(0, 10);
            const pub_login = req.body.pub_login;
            const pub_badge = req.body.pub_badge;
            const site = req.body.site;
            const screen = req.body.screen;
            const starts = req.body.starts;
            const ends = req.body.ends;
            const title = req.body.title;
            const message = req.body.message;
            const pub_name = req.body.pub_name;
            const pub_title = req.body.pub_title;
            const ctitle = req.body.c_title;
            const cmessage = req.body.c_message;

            const DataResponse = await MessageDAO.addNewMessage(created, pub_login, pub_badge, site, screen, starts, ends, title, message, pub_name, pub_title, ctitle, cmessage);

            res.json({status: 'completed', code: '1', message: 'success', mid: DataResponse.insertedId })
        } catch (e) {
            console.log(e);
            res.json({status: 'completed', code: '0', message: 'fail', mid: '' });
        }
    }

    static async updateMessage(req, res, next) {
        try {
            const mid = req.body.mid;
            let screen = "";
            let starts = "";
            let ends = "";
            let title = ""
            let message = "";
            let pub_name = "";
            let pub_title = "";    
            let ctitle = "";
            let cmessage = "";   

            if(req.body.screen) {screen =  req.body.screen;}
            if(req.body.starts) {starts = req.body.starts;}
            if(req.body.ends) {ends = req.body.ends;}
            if(req.body.title) {title = req.body.title;}
            if(req.body.message) {message = req.body.message;}
            if(req.body.pub_name) {pub_name = req.body.pub_name;}
            if(req.body.pub_title) {pub_title = req.body.pub_title;}
            if(req.body.c_title) {ctitle = req.body.c_title;}
            if(req.body.c_message) {cmessage = req.body.c_message;}

            const UpdateResponse =  await MessageDAO.updateMessage(mid, screen, starts, ends, title, message, pub_name, pub_title, ctitle, cmessage);

            const { error } = UpdateResponse;

            if(error) {
                res.json({status: 'completed', code: '0', message: 'fail' });
            }

            if(UpdateResponse.modifiedCount === 0) {
                throw new Error('unable to update Message');
            }

            res.json({status: 'completed', code: '1', message: 'success' })
        } catch (e) {
            res.json({status: 'completed', code: '0', message: 'fail' });
        }
    }

    static async ssuppressMessage(req, res, next) {
        try {
            const mid = req.body.mid;

            const MessageResponse = await MessageDAO.supressMessage(mid);

            res.json({status: 'completed', code: '1', message: 'success' });
        } catch (e) {
            res.json({status: 'completed', code: '0', message: 'fail' });
        }
    }
}