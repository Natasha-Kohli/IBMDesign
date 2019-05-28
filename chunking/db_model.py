import inflection
from sqlalchemy.ext.declarative import (declared_attr, declarative_base,
                                        has_inherited_table)
from sqlalchemy import (Column, BigInteger, String, DateTime, ForeignKey, UniqueConstraint)
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


class Streets(Base):
    name = Column(String(255))

class Node(Base):
    id = Column(BigInteger, primary_key = True, autoincrement = False)
    location = Column(Geography(geometry_type='POINT', srid=4326))

class StreetHasNode(Base):
    street = Column(BigInteger, ForeignKey('streets.id'))
    node = Column(BigInteger, ForeignKey('node.id'))

class Intersection(Base):
    street_1 = Column(BigInteger, ForeignKey('streets.id'))
    street_2 = Column(BigInteger, ForeignKey('streets.id'))
    location = Column(Geography(geometry_type='POINT', srid=4326))

class Pickup(Base):
    # "Date/Time","Lat","Lon","Base"
    time = Column(DateTime)
    location = Column(Geography(geometry_type='POINT', srid=4326))
    base = Column(String(63))
    intersection = Column(BigInteger, ForeignKey('intersection.id'))
