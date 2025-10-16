import { DeleteTaskUseCase } from '@core/application/usecases/delete-task';
import { InMemoryTaskRepository } from '../utils/repositories/in-memory-task-repository';
import { makeTask } from '../utils/factories/make-task';
import { UniqueId } from '@core/domain/value-objects/unique-id';

let taskRepository: InMemoryTaskRepository;
let sut: DeleteTaskUseCase;

describe('DeleteTaskUseCase', () => {
  beforeEach(() => {
    taskRepository = new InMemoryTaskRepository();
    sut = new DeleteTaskUseCase(taskRepository);
  });

  it('should be able to delete a task', async () => {
    const task = makeTask();
    taskRepository.items.push(task);

    await sut.execute(task.id);

    expect(taskRepository.items).toHaveLength(0);
  });

  it('should not be able to delete non-existent task', async () => {
    const nonExistentId = UniqueId.create();

    await expect(sut.execute(nonExistentId)).rejects.toThrow('Task not found');
  });
});
