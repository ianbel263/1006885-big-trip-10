export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.price = data[`base_price`];
    this.startDate = data[`date_from`] ? new Date(data[`date_from`]) : null;
    this.endDate = data[`date_to`] ? new Date(data[`date_to`]) : null;
    this.destination = data[`destination`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`] || [];
    this.type = data[`type`];
    // this.description = data[`description`] || ``;
    // this.dueDate = data[`due_date`] ? new Date(data[`due_date`]) : null;
    // this.tags = new Set(data[`tags`] || []);
    // this.repeatingDays = data[`repeating_days`];
    // this.color = data[`color`];
    // this.isFavorite = Boolean(data[`is_favorite`]);
    // this.isArchive = Boolean(data[`is_archived`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'destination': this.destination,
      'date_from': this.startDate, // ? this.dueDate.toISOString() : null,
      'date_to': this.endDate,
      'offers': this.offers,
      'type': this.type,
      'is_favorite': this.isFavorite,
      'base_price': this.price
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
