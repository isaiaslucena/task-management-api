import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.do';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  getTaskWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTaskWithFilters(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const foundTask = await this.taskRepository.findOne(id);

    if (!foundTask) throw new NotFoundException(`Task with ID ${id} not found!`);

    return foundTask;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: number): Promise<Task> {
    const deletedTask = this.getTaskById(id);
    const deleteResult = await this.taskRepository.delete(id);

    if (deleteResult.affected === 0) throw new NotFoundException(`Task with ID ${id} not found!`);

    return deletedTask;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const updateResult = await this.taskRepository.createQueryBuilder()
      .update('task')
      .set({ status })
      .where("id = :id", { id })
      .execute();

    if (updateResult.affected === 0) throw new NotFoundException(`Task with ID ${id} not found!`);

    const updatedTask = this.getTaskById(id);

    return updatedTask;
  }
}
