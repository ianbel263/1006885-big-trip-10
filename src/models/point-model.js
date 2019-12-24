export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.price = data[`base-price`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
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
    // return {
    //   'id': this.id,
    //   'description': this.description,
    //   'due_date': this.dueDate ? this.dueDate.toISOString() : null,
    //   'tags': Array.from(this.tags),
    //   'repeating_days': this.repeatingDays,
    //   'color': this.color,
    //   'is_favorite': this.isFavorite,
    //   'is_archived': this.isArchive,
    // };
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
