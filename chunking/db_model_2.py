import inflection
from sqlalchemy.ext.declarative import (declared_attr, declarative_base,
                                        has_inherited_table)
from sqlalchemy import (Column, Integer, BigInteger, String, DateTime, ForeignKey, UniqueConstraint)
from geoalchemy2 import Geography

class Base(object):
    """Generic base class for all models."""
    @declared_attr
    def __tablename__(cls):
        """Set the tablename as the class name in snake_case.

        Pattern from:

        http://docs.sqlalchemy.org/en/latest/orm/extensions/declarative/mixins.html#controlling-table-inheritance-with-mixins
        """
        if has_inherited_table(cls):
            return None
        return inflection.underscore(cls.__name__)

    id = Column(BigInteger, primary_key=True, autoincrement=True)

Base = declarative_base(cls=Base)


class Pickup(Base):
    time = Column(DateTime)
    location = Column(Geography(geometry_type='POINT', srid=4326))
    base = Column(String(63))
    x_coordinate = Column(Integer)
    y_coordinate = Column(Integer)
    location_chunk = Column(BigInteger)
    week_chunk = Column(Integer) 
    month_chunk = Column(Integer)