import json # модуль для работы с файлом alert.json
import csv # модуль csv для разбора логов conn.log
from pydantic import BaseModel # базовый класс для создание моделей из pydantic
from typing import Optional # optional из модуля typing, чтобы пометить поля которые могут быть пустыми

# Модели

# Модель для описания входящего алерта
class Alert(BaseModel):
    timestamp: str # время срабатывания
    description: str # описание правила, угрозы
    severity: int # степень критичности - число
    src_ip: str # айпи источника
    dst_ip: str # айпи получателя

# Модель для описания соединения из conn.log!!!!1
class Event(BaseModel):
    timestamp: str # время срабатывания
    src_ip: str # айпи источника
    dst_ip: str # айпи получателя
    src_port: int # порт источника
    dst_port: int # порт получателя
    proto: str # протокол

# Поля, которые могут быть пустыми (могут отсуствовать в логе - None )
    service: Optional[str] = None # служба - http, dns......
    duration: Optional[float] = None # длительность соединения в сек
    bytes_sent: Optional[int] = None # кол-во отправленных байт
    uid: str # идентификатор соединения в логах


# Парсинг алерта

# принимает путь к файлу alert.json и возвращает Alert
def parse_alert_file(file_path: str) -> Alert | None: # получаю строчку str, возвращаю или Aler или None
    try: # попробовать это:
        with open(file_path, 'r', encoding='utf-8') as f: # открываем файл для чтеня r с кодировкой utf-8
            raw_data = json.load(f) # читаем текст из файла и превращаем его в словарь 
        valid_alert = Alert(**raw_data) # передаем словарь в алерт(распаковываем словарь в аргументы модели), а pydantic проверяет правильность типов данных
        return valid_alert
    except Exception as e: # если есть проблемы сделать это
        print(f'Ошибка при чтении алерта из {file_path}: {e}') # e - там ошибки
        return None 


# Парсинг сетевого лога

# принимает путь к conn.log и возвращает список готовых объектов Event
def parse_conn_log(file_path: str) -> list[Event]: # получаю строку str, кладу в лист евент
    events = [] # в этот список складываем успешные события
    try: # попробовать это
        with open(file_path, 'r', encoding='utf-8') as f: # открываем файл для чтеня r с кодировкой utf-8
            fieldname = [] # список для названия колонок
            cleanline = [] # чистые строки 

            for line in f: # читаем файл 
                if line.startswith('#fields'): # если текущая строка начинается с #fields(там названия всех колонок)
                    fieldname = line.strip().split('\t')[1:] # применяется: strip() - отрезаем невидимый символ переноса строки, и пробелы в начале и конце, split('\t') -  разрезает строку на список везде, где стоит \t
                elif not line.startswith('#'): # иначе если строка не начинается с решетки
                    cleanline.append(line) # кладем эту строчку с данными в список
           
            reader = csv.DictReader(cleanline, fieldnames=fieldname, delimiter='\t') # csv.DictReader превращает каждую строчку текста в словарь, указываем разделитель delimiter='\t' т.к колонки разеделены ею
            for row in reader:
                try:
                    event = Event( # создаем объект Event, сопоставляя колонки с полями
                        timestamp=row.get('ts', ''),
                        src_ip=row.get('id.orig_h', ''),
                        dst_ip=row.get('id.resp_h', ''),

                        #строковые порты в целые числа:
                        src_port=int(row.get('id.orig_p', 0)),
                        dst_port=int(row.get('id.resp_p', 0)),

                        proto=row.get('proto', ''),

                        #проверка на -, зик ставит его, если данных в таблице нет
                        service=row.get('service') if row.get('service') != '-' else None,

                        # длительность в дробное число, если она есть
                        duration=float(row['duration']) if row.get('duration', '-').replace('.','').isdigit() else None,

                        # превращаем байты в целое число, если это цифры конечно
                        bytes_sent=int(row['orig_bytes']) if row.get('orig_bytes', '-').isdigit() else None,

                        uid=row.get('uid', '')
                    )


                    # добавляем созданный объект в список
                    events.append(event)
                except Exception as row_error: # если какая-то строчка в логе повреждена пропускаем ее и продолжаем
                    continue

    except Exception as file_error:
        print(f'Ошибка при открытии файла {file_path}: {file_error}')   
    return events             

if __name__ == "__main__":
    # Проверяем парсер алерта
    alert = parse_alert_file("test_alert.json")
    print("Результат алерта:")
    print(alert)

    print("-" * 30)

    # Проверяем парсер conn.log
    events = parse_conn_log("test_conn.log")
    print(f"Успешно распарсено событий: {len(events)}")
    for event in events:
        print(event)



























