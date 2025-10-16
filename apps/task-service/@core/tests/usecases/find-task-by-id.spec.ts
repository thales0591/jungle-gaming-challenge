import { FindTaskByIdUseCase } from '@core/application/usecases/find-task-by-id';
import { InMemoryTaskRepository } from '../utils/repositories/in-memory-task-repository';
import { makeTask } from '../utils/factories/make-task';
import { makeUserReadModel } from '../utils/factories/make-user-read-model';
import { UniqueId } from '@core/domain/value-objects/unique-id';

let taskRepository: InMemoryTaskRepository;
let sut: FindTaskByIdUseCase;

describe('FindTaskByIdUseCase', () => {
  beforeEach(() => {
    taskRepository = new InMemoryTaskRepository();
    sut = new FindTaskByIdUseCase(taskRepository);
  });

  it('should be able to find task by id', async () => {
    const author = makeUserReadModel();
    taskRepository.addUser(author);

    const task = makeTask({ authorId: author.id });
    taskRepository.items.push(task);

    const result = await sut.execute(task.id);

    expect(result).toBeDefined();
    expect(result.task.id.value).toBe(task.id.value);
    expect(result.author.id).toBe(author.id.value);
  });

  it('should not be able to find non-existent task', async () => {
    const nonExistentId = UniqueId.create();

    await expect(sut.execute(nonExistentId)).rejects.toThrow('Task not found');
  });
});
