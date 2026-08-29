const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (existing.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [
            name,
            email,
            hashedPassword,
        ]);

        res.json({
            message: "User created",
            userId: result.insertId,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

//     const user = users[0];

//     if (!user) {
//         return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // (пароль ты уже проверяешь у себя)

//     const token = jwt.sign(
//         {
//             id: user.id,
//             role: user.role, // 👈 ВАЖНО
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" },
//     );

//     res.json({
//         token,
//         user: {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//         },
//     });
// };

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Ищем пользователя в базе данных
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = users[0];

        // Если пользователь не найден
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 2. Проверяем корректность пароля
        // user.password — это хэш из вашей базы данных
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        // Если пароль не совпадает
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 3. Создаем JWT токен, если проверка прошла успешно
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        // 4. Возвращаем ответ клиенту
        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        // Хэндлинг непредвиденных ошибок сервера
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.me = async (req, res) => {
    try {
        const userId = req.user.id;

        const [users] = await db.query("SELECT id, name, email, role FROM users WHERE id = ?", [userId]);

        res.json(users[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
