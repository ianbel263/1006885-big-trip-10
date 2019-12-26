import moment from 'moment';

export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.price = data[`base_price`];
    this.startDate = moment(data[`date_from`]).valueOf();
    this.endDate = moment(data[`date_to`]).valueOf();
    this.destination = data[`destination`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`] || [];
    this.type = data[`type`];
  }

  toRAW() {
    return {
      'id': this.id,
      'base_price': this.price,
      'date_from': moment(this.startDate).toISOString(),
      'date_to': moment(this.endDate).toISOString(),
      'destination': this.destination,
      'is_favorite': this.isFavorite,
      'offers': this.offers,
      'type': this.type
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
