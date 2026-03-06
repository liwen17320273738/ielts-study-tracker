import sqlite3
import json
import os

DB_PATH = os.environ.get("DB_PATH", os.path.join("data", "tracker.db"))


def get_db() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(DB_PATH) or ".", exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS checkins (
        day_number INTEGER PRIMARY KEY,
        tasks      TEXT    NOT NULL DEFAULT '{}',
        study_minutes INTEGER NOT NULL DEFAULT 0,
        notes      TEXT    NOT NULL DEFAULT '',
        mood       TEXT    NOT NULL DEFAULT '',
        date       TEXT
    );

    CREATE TABLE IF NOT EXISTS mock_exam_scores (
        exam_id   INTEGER PRIMARY KEY,
        listening REAL,
        reading   REAL,
        writing   REAL,
        speaking  REAL,
        total     REAL,
        date      TEXT,
        notes     TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS vocab_mastery (
        word     TEXT PRIMARY KEY,
        mastered INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS app_config (
        key   TEXT PRIMARY KEY,
        value TEXT
    );
    """)
    conn.commit()
    conn.close()


def load_full_state() -> dict:
    conn = get_db()

    checkins = {}
    for row in conn.execute("SELECT * FROM checkins"):
        checkins[str(row["day_number"])] = {
            "dayNumber": row["day_number"],
            "tasks": json.loads(row["tasks"]),
            "studyMinutes": row["study_minutes"],
            "notes": row["notes"],
            "mood": row["mood"],
            "date": row["date"],
        }

    mock_scores = {}
    for row in conn.execute("SELECT * FROM mock_exam_scores"):
        mock_scores[str(row["exam_id"])] = {
            "id": row["exam_id"],
            "listening": row["listening"],
            "reading": row["reading"],
            "writing": row["writing"],
            "speaking": row["speaking"],
            "total": row["total"],
            "date": row["date"],
            "notes": row["notes"],
        }

    vocab = {}
    for row in conn.execute("SELECT word FROM vocab_mastery WHERE mastered = 1"):
        vocab[row["word"]] = True

    start_date = "2026-03-05"
    row = conn.execute(
        "SELECT value FROM app_config WHERE key = 'start_date'"
    ).fetchone()
    if row:
        start_date = row["value"]

    conn.close()
    return {
        "checkins": checkins,
        "mockExamScores": mock_scores,
        "vocabMastered": vocab,
        "dailyNotes": {},
        "startDate": start_date,
    }


def save_full_state(data: dict):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("DELETE FROM checkins")
    for _key, c in data.get("checkins", {}).items():
        cur.execute(
            "INSERT INTO checkins (day_number, tasks, study_minutes, notes, mood, date) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (
                c["dayNumber"],
                json.dumps(c["tasks"], ensure_ascii=False),
                c.get("studyMinutes", 0),
                c.get("notes", ""),
                c.get("mood", ""),
                c.get("date"),
            ),
        )

    cur.execute("DELETE FROM mock_exam_scores")
    for _key, e in data.get("mockExamScores", {}).items():
        cur.execute(
            "INSERT INTO mock_exam_scores "
            "(exam_id, listening, reading, writing, speaking, total, date, notes) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                e["id"],
                e.get("listening"),
                e.get("reading"),
                e.get("writing"),
                e.get("speaking"),
                e.get("total"),
                e.get("date"),
                e.get("notes", ""),
            ),
        )

    cur.execute("DELETE FROM vocab_mastery")
    for word, mastered in data.get("vocabMastered", {}).items():
        if mastered:
            cur.execute(
                "INSERT INTO vocab_mastery (word, mastered) VALUES (?, 1)", (word,)
            )

    cur.execute(
        "INSERT OR REPLACE INTO app_config (key, value) VALUES ('start_date', ?)",
        (data.get("startDate", "2026-03-05"),),
    )

    conn.commit()
    conn.close()
