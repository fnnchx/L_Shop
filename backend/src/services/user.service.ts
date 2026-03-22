import FileStorage from '../utils/fileStorage';
import { User, UserCreateDTO } from '../types/user.types';
import { randomUUID } from 'crypto';

class UserService {
    private userStorage: FileStorage;

    constructor() {
        this.userStorage = new FileStorage('users.json');
    }

    async createUser(userData: UserCreateDTO): Promise<User> {
        // Проверяем существование пользователя
        const users = await this.userStorage.readData<User[]>();
        const existingUser = users.find(
            u => u.email === userData.email || u.login === userData.login
        );
        
        if (existingUser) {
            throw new Error('User with this email or login already exists');
        }

        const newUser: User = {
            id: randomUUID(),
            ...userData,
            createdAt: new Date()
        };

        await this.userStorage.create(newUser);
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword as User;
    }

    async validateUser(login: string, password: string): Promise<Omit<User, 'password'> | null> {
        const users = await this.userStorage.readData<User[]>();
        const user = users.find(u => (u.login === login || u.email === login) && u.password === password);
        
        if (!user) return null;
        
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.userStorage.findById<User>(id);
        if (!user) return null;
        
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

export default UserService;