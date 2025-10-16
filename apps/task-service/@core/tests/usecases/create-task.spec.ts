import { CreateTaskUseCase } from '@core/application/usecases/create-task';
import { InMemoryTaskRepository } from '../utils/repositories/in-memory-task-repository';
import { InMemoryUserReadModelRepository } from '../utils/repositories/in-memory-user-read-model-repository';
import { InMemoryTaskAuditLogRepository } from '../utils/repositories/in-memory-task-audit-log-repository';
import { FakeEventPublisher } from '../utils/fakes/fake-event-publisher';
import { makeUserReadModel } from '../utils/factories/make-user-read-model';
import { TaskPriority, TaskStatus } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';

let taskRepository: InMemoryTaskRepository;
let userRepository: InMemoryUserReadModelRepository;
let auditLogRepository: InMemoryTaskAuditLogRepository;
let eventPublisher: FakeEventPublisher;
let sut: CreateTaskUseCase;

describe('CreateTaskUseCase', () => {
  beforeEach(() => {
    taskRepository = new InMemoryTaskRepository();
    userRepository = new InMemoryUserReadModelRepository();
    auditLogRepository = new InMemoryTaskAuditLogRepository();
    eventPublisher = new FakeEventPublisher();
    sut = new CreateTaskUseCase(
      taskRepository,
      userRepository,
      eventPublisher,
      auditLogRepository,
    );
  });

  it('should be able to create a new task', async () => {
    const author = makeUserReadModel();
    await userRepository.save(author);

    const task = await sut.execute({
      authorId: author.id,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: null,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      assignedUserIds: [],
    });

    expect(task).toBeDefined();
    expect(task.title).toBe('Test Task');
    expect(taskRepository.items).toHaveLength(1);
  });

  it('should be able to create task and emit event', async () => {
    const author = makeUserReadModel();
    await userRepository.save(author);

    const task = await sut.execute({
      authorId: author.id,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: null,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      assignedUserIds: [],
    });

    const event = eventPublisher.findEvent('task.created');
    expect(event).toBeDefined();
    expect(event?.payload.title).toBe('Test Task');
  });

  it('should be able to create audit log when creating task', async () => {
    const author = makeUserReadModel();
    await userRepository.save(author);

    await sut.execute({
      authorId: author.id,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: null,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      assignedUserIds: [],
    });

    expect(auditLogRepository.items).toHaveLength(1);
    expect(auditLogRepository.items[0].action).toBe('CREATED');
  });

  it('should not be able to create task if author does not exist', async () => {
    const nonExistentAuthorId = UniqueId.create();

    await expect(
      sut.execute({
        authorId: nonExistentAuthorId,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: null,
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        assignedUserIds: [],
      }),
    ).rejects.toThrow('User not found');
  });

  it('should not be able to create task if assigned user does not exist', async () => {
    const author = makeUserReadModel();
    await userRepository.save(author);

    const nonExistentUserId = UniqueId.create();

    await expect(
      sut.execute({
        authorId: author.id,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: null,
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        assignedUserIds: [nonExistentUserId],
      }),
    ).rejects.toThrow('Some assigned users do not exist');
  });
});
