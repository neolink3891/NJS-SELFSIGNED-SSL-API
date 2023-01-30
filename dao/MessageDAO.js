import mongodb from 'mongodb';

export default class MessageDAO {
    static messages;

    static ObjectId = mongodb.ObjectId;

    static async injectDB(conn) {
        if (MessageDAO.messages) {
            return;
        }
        try {
            MessageDAO.messages = await conn.db(process.env.MDB_NS).collection('messages');
        } catch (e) {
            console.error('unable to stabilish connection hande in MessageDAO');
        }
    }

    static async addNewMessage(_created, _pub_login, _pub_badge, _site, _screen, _starts, _ends, _title, _message, _pub_name, _pub_title, _ctitle, _cmessage) {
        try {
            const DataDoc = {
                active: "1",
                created: _created,
                pub_login: _pub_login,
                pub_badge: _pub_badge,
                pub_name: _pub_name,
                pub_title: _pub_title,
                site: _site,
                screen: _screen,
                starts: _starts,
                ends: _ends,
                title: _title,
                message: _message,
                ctitle: _ctitle,
                cmessage: _cmessage
            };
            return await MessageDAO.messages.insertOne(DataDoc);
        } catch (e) {
            console.error('Unable to post new Message');
            return {error: e};
        }
    }

    static async updateMessage(_mid, _screen, _starts, _ends, _title, _message, _pub_name, _pub_title, _ctitle, _cmessage) {
        try {
            let updateFields = {};
            if(_screen.length > 0) {updateFields.screen = _screen;}
            if(_starts.length > 0) {updateFields.starts = _starts;}
            if(_ends.length > 0) {updateFields.ends = _ends;}
            if(_title.length > 0) {updateFields.title = _title;}
            if(_message.length > 0) {updateFields.message = _message;}
            if(_pub_name.length > 0) {updateFields.pub_name = _pub_name;}
            if(_pub_title.length > 0) {updateFields.pub_title = _pub_title;}
            updateFields.ctitle = _ctitle;
            updateFields.cmessage = _cmessage;

            const DataResponse =  await MessageDAO.messages.updateOne(
                {_id: MessageDAO.ObjectId(_mid)},
                {$set: updateFields}
            );
            return DataResponse;
        } catch (e) {
            console.error('Unable to Update Message');
            return {error: e};
        }
    }

    static async supressMessage(_mid) {
        try {
            const deleteResponse = await MessageDAO.messages.updateOne(
                {_id: MessageDAO.ObjectId(_mid)},
                {$set: {active: '0'}}
            );
            return deleteResponse;
        } catch (e) {
            console.error('Unable to delete Message');
            return {error: e};
        }
    }
}
