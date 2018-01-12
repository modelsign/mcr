export class DownloadTask {
    id: number;
    url: string;
    status: string;
}


export class DownloadController {
    _tasks: DownloadTask[];

    add(task: DownloadTask) {

    }

    async start(taskId: number): Promise<any> {

    }

    async stop(taskId: number): Promise<any> {

    }
}
