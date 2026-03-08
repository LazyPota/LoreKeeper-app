from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./lorekeeper.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class LoreEntry(Base):
    __tablename__ = "lore_entries"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True) 
    name = Column(String, index=True)     
    description = Column(Text)            