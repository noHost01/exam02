import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const pool = mysql.createPool({
  host: "localhost",
  user: "sbsst",
  password: "sbs123414",
  database: "Famous",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();

const corsOptions = {
  origin: "https://cdpn.io",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());

const port = 3000;

app.patch("/say/:id", async (req, res) => {
  //const id = req.params.id;
  const { id } = req.params;

  const [rows] = await pool.query(
    `
    SELECT *
    FROM say
    WHERE id = ?
    `,
    [id]
  );

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }

  const { regDate, content, Auter } = req.body;

  if (!regDate) {
    res.status(400).json({
      msg: "regDate required",
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return;
  }

  if (!Auter) {
    res.status(400).json({
      msg: "Auter required",
    });
    return;
  }

  const [rs] = await pool.query(
    `
    UPDATE say
    SET regDate = ?,
    content = ?,
    Auter = ?
    WHERE id = ?
    `,
    [regDate, content, Auter, id]
  );

  res.json({
    msg: `${id}번이 수정되었습니다.`,
  });
});

// 단건조회
app.get("/say/:id", async (req, res) => {
  //const id = req.params.id;
  const { id } = req.params;

  const [rows] = await pool.query(
    `
    SELECT *
    FROM say
    WHERE id = ?
    `,
    [id]
  );

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return;
  }

  res.json(rows[0]);
});

// 전체 조회
app.get("/say", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM say ORDER BY id DESC");

  res.json(rows);
});

// 랜덤조회
app.get("/sayLn", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM say ORDER BY RAND() LIMIT 1");

  res.json(rows);
});

// 삭제
app.delete("/say/:id", async (req, res) => {
  //const id = req.params.id;
  const { id } = req.params;

  const [rows] = await pool.query(
    `
    SELECT *
    FROM say
    WHERE id = ?
    `,
    [id]
  );

  const [rs] = await pool.query(
    `
    DELETE FROM say
    WHERE id = ?`,
    [id]
  );

  res.json({
    msg: `${id}번이 삭제되었습니다. `,
  });
});

// 생성
app.post("/say", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM say ORDER BY id DESC");

  const [rs] = await pool.query(
    `
    INSERT INTO todo
    SET regDate = NOW(),
    content = '곧 위에 비교하면 족하지 못하나,아래에 비교하면 남음이 있다.',
    Auter = '명심보감'
    `
  );

  res.json({
    msg: `생성이 완료되었습니다.`,
  });
});

app.listen(port);
