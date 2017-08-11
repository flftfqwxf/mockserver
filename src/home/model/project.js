export default class project extends think.model.base {
    async getAllProjects() {
        return await this.model('project').select();
    }

    async getProjectById(id) {
        return await this.model('project').where({project_id: id}).find();
    }

    async getProjectByName(project_name) {
        return await this.model('project').where({project_name: project_name}).find()
    }

    async deleteProjectById(id) {
        return await this.model('project').where({project_id: id}).delete();
    }
}