import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";
import { Like } from 'typeorm';
import { GetTasksFilterDto } from "./dto/get-tasks-filter.do";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTaskWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const w: {
      status?: string;
      where?: [
        { title?: any; },
        { description?: any; }
      ]
    } = {};

    if (status) w.status = status;

    if (search) {
      w.where = [{ title: Like(`%${search}%`) }, { description: Like(`%${search}%`) }];
    }

    const result = await this.find(w);

    return result;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }
}