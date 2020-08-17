---
layout: post
title: sqlalchemy
category: Python
tags: Python 
keywords: Python sqlalchemy
description: 
---


为什么要使用ORM框架？

为了方便，降低出错概率，可读性更好。


### 基本操作

```
连接数据
#Unix/Mac - 4 initial slashes in total
engine = create_engine('sqlite:////absolute/path/to/foo.db')
#Windows
engine = create_engine('sqlite:///C:\\path\\to\\foo.db')
#Windows alternative using raw string
engine = create_engine(r'sqlite:///C:\path\to\foo.db')


创建引擎
engine = create_engine('sqlite:///foo.db?check_same_thread=False', echo=True)


定义映射
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()


创建实体类
from sqlalchemy import Column, Integer, String

# 定义映射类User，其继承上一步创建的Base
class User(Base):
    # 指定本类映射到users表
    __tablename__ = 'users'
    # 如果有多个类指向同一张表，那么在后边的类需要把extend_existing设为True，表示在已有列基础上进行扩展
    # 或者换句话说，sqlalchemy允许类是表的字集
    # __table_args__ = {'extend_existing': True}
    # 如果表在同一个数据库服务（datebase）的不同数据库中（schema），可使用schema参数进一步指定数据库
    # __table_args__ = {'schema': 'test_database'}
    
    # 各变量名一定要与表的各字段名一样，因为相同的名字是他们之间的唯一关联关系
    # 从语法上说，各变量类型和表的类型可以不完全一致，如表字段是String(64)，但我就定义成String(32)
    # 但为了避免造成不必要的错误，变量的类型和其对应的表的字段的类型还是要相一致
    # sqlalchemy强制要求必须要有主键字段不然会报错，如果要映射一张已存在且没有主键的表，那么可行的做法是将所有字段都设为primary_key=True
    # 不要看随便将一个非主键字段设为primary_key，然后似乎就没报错就能使用了，sqlalchemy在接收到查询结果后还会自己根据主键进行一次去重
    # 指定id映射到id字段; id字段为整型，为主键，自动增长（其实整型主键默认就自动增长）
    id = Column(Integer, primary_key=True, autoincrement=True)
    # 指定name映射到name字段; name字段为字符串类形，
    name = Column(String(20))
    fullname = Column(String(32))
    password = Column(String(32))

    # __repr__方法用于输出该类的对象被print()时输出的字符串，如果不想写可以不写
    def __repr__(self):
        return "<User(name='%s', fullname='%s', password='%s')>" % (
                   self.name, self.fullname, self.password)



# 查看映射对应的表
User.__table__

# 创建数据表。一方面通过engine来连接数据库，另一方面根据哪些类继承了Base来决定创建哪些表
# checkfirst=True，表示创建表前先检查该表是否存在，如同名表已存在则不再创建。其实默认就是True
Base.metadata.create_all(engine, checkfirst=True)

# 上边的写法会在engine对应的数据库中创建所有继承Base的类对应的表，但很多时候很多只是用来则试的或是其他库的
# 此时可以通过tables参数指定方式，指示仅创建哪些表
# Base.metadata.create_all(engine,tables=[Base.metadata.tables['users']],checkfirst=True)
# 在项目中由于model经常在别的文件定义，没主动加载时上边的写法可能写导致报错，可使用下边这种更明确的写法
# User.__table__.create(engine, checkfirst=True)

# 另外我们说这一步的作用是创建表，当我们已经确定表已经在数据库中存在时，我完可以跳过这一步
# 针对已存放有关键数据的表，或大家共用的表，直接不写这创建代码更让人心里踏实


创建会话

# engine是2.2中创建的连接
Session = sessionmaker(bind=engine)

# 创建Session类实例
session = Session()


新增
# 创建User类实例
ed_user = User(name='ed', fullname='Ed Jones', password='edspassword')

# 将该实例插入到users表
session.add(ed_user)

# 一次插入多条记录形式
session.add_all(
    [User(name='wendy', fullname='Wendy Williams', password='foobar'),
    User(name='mary', fullname='Mary Contrary', password='xxg527'),
    User(name='fred', fullname='Fred Flinstone', password='blah')]
)

# 当前更改只是在session中，需要使用commit确认更改才会写入数据库
session.commit()


查询
our_user = session.query(User).filter_by(name='ed').first()

our_user

# 比较ed_user与查询到的our_user是否为同一条记录
ed_user is our_user

# 只获取指定字段
# 但要注意如果只获取部分字段，那么返回的就是元组而不是对象了
# session.query(User.name).filter_by(name='ed').all()
# like查询
# session.query(User).filter(User.name.like("ed%")).all()
# 正则查询
# session.query(User).filter(User.name.op("regexp")("^ed")).all()
# 统计数量
# session.query(User).filter(User.name.like("ed%")).count()
# 调用数据库内置函数
# 以count()为例，都是直接func.func_name()这种格式，func_name与数据库内的写法保持一致
# from sqlalchemy import func
# session.query(func.count(User3.name)).one()
# 字段名为字符串形式
# column_name = "name"
# session.query(User).filter(User3.__table__.columns[column_name].like("ed%")).all()
# 获取执行的sql语句
# 获取记录数的方法有all()/one()/first()等几个方法，如果没加这些方法，得到的只是一个将要执行的sql对象，并没真正提交执行
# from sqlalchemy.dialects import mysql
# sql_obj = session.query(User).filter_by(name='ed')
# sql_command = sql_obj.statement.compile(dialect=mysql.dialect(), compile_kwargs={"literal_binds": True})
# sql_result = sql_obj.all()


修改

# session.query(User).filter_by(name='ed').update({User.password: 'modify_passwd'})
# session.commit()

删除
# 要删除需要先将记录查出来
del_user = session.query(User).filter_by(name='ed').first()

# 打印一下，确认未删除前记录存在
del_user

# 将ed用户记录删除
session.delete(del_user)

# 确认删除
session.commit()

# 遍历查看，已无ed用户记录
for user in session.query(User):
    print(user)

# 但上边的写法，先查询再删除，相当于给mysql服务端发了两条语句，和我们印象中的delete语句不一致
# 可直接使用下边的写法，传给服务端的就是delete语句
# session.query(User).filter_by(name='ed').first().delete()

```


### 参考

- github官方地址：[https://github.com/sqlalchemy/sqlalchemy](https://github.com/sqlalchemy/sqlalchemyÎ)
- 文档地址：[https://docs.sqlalchemy.org/en/13/](https://docs.sqlalchemy.org/en/13/)
- [https://docs.sqlalchemy.org/en/13/orm/tutorial.html](https://docs.sqlalchemy.org/en/13/orm/tutorial.html)


