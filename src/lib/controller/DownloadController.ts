export class DownloadTask {
    id: number;
    url: string;
    status: string;
}


export default class DownloadController {
    _tasks: DownloadTask[];

    add(task: DownloadTask) {

    }

    async start(taskId: number): Promise<any> {

    }

    async stop(taskId: number): Promise<any> {

    }
}
