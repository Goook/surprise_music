import pymysql
import re

f = open('singer_id_to_name.txt', encoding='utf-8')
db = pymysql.connect(host='39.96.194.42', user='root',
                     password='bamboo', db='surprise_music',
                     charset='utf8')
cursor = db.cursor()

for line in f:
    L = re.split(r',', line)
    L = [l.strip() for l in L]
    sql = "insert into singer \
          (id, singer_name) \
          values('%s','%s')" % \
          (L[0], L[1])
    try:
        cursor.execute(sql)
        db.commit()
        print('ok')
    except Exception as e:
        db.rollback()
        print(e)

f.close()
