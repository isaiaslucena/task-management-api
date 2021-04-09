import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.do';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) {}

  async getAllTasks(user: User): Promise<Task[]> {
    return this.taskRepository.find({ user });
  }

  getTaskWithFilters(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTaskWithFilters(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const foundTask = await this.taskRepository.findOne({ id, user });

    if (!foundTask) throw new NotFoundException(`Task with ID ${id} not found!`);

    return foundTask;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<Task> {
    const deletedTask = this.getTaskById(id, user);
    const deleteResult = await this.taskRepository.delete({id, user});

    if (deleteResult.affected === 0) throw new NotFoundException(`Task with ID ${id} not found!`);

    return deletedTask;
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User
  ): Promise<Task> {
    const updateResult = await this.taskRepository.createQueryBuilder()
      .update('task')
      .set({ status })
      .where("id = :id", { id })
      .where("userId = :userId", { userId: user.id })
      .execute();

    if (updateResult.affected === 0) throw new NotFoundException(`Task with ID ${id} not found!`);

    const updatedTask = this.getTaskById(id, user);

    return updatedTask;
  }
}
