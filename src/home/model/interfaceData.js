export default class interfaceData extends think.model.base {


    async getInterfaceById(id) {
        return await this.model('mockserver').where({mockid: id}).find();
    }

}