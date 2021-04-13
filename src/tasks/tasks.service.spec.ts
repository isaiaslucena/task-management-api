import { Test } from '@nestjs/testing';
import { GetTasksFilterDto } from './dto/get-tasks-filter.do';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = { username: 'User', password: '123QwertY321' };

const mockTaskRepository = () => ({
  getTasks: jest.fn()
});

describe('TaskService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository }
      ]
    }).compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
    taskRepository = moduleRef.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('get all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('value');

      expect(taskRepository.getTasks).not.toHaveBeenCalled()

      const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search' };
      const result = await tasksService.taskRepository.getTasks(filters, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('value');
    });
  });
})