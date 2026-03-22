import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import UserService from './services/user.service';

const app: Application = express();
const PORT = process.env.PORT || 5000;
const userService = new UserService();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

// Статика для фронта
app.use(express.static(path.join(__dirname, '../../public')));

// Тестовый роут
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Регистрация пользователя
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, user });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Вход пользователя
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
    const user = await userService.validateUser(login, password);
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Получение пользователя по ID
app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Обработка ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});