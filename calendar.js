/**
 * Calendar 0.0.1
 * 
 * Meraseudev (meraseudev@gmail.com)
 * Copyright 2017, MIT License
 */

window.Calendar = (function (Calendar) {

    Calendar = function (container, options) {
        if(!container) {
            return;
        }
        this.container = container;
        this.options = options;
        this.clickAfter = this.options.clickAfter || function() {};
        this.init();
    }

    Calendar.prototype = {
        init : function() {
            var self = this;

            this.days = moment.weekdaysShort();

            // set header
            var header = document.createElement('div'),
                date = document.createElement('div'),
                buttonPrev = document.createElement('button'),
                buttonNext = document.createElement('button');

            header.classList.add('calendar-header');
            date.classList.add('date');

            this.setAttr(buttonPrev, {
                'type': 'button',
                'class': 'button button-prev'
            });
            this.setAttr(buttonNext, {
                'type': 'button',
                'class': 'button button-next'
            });

            buttonPrev.innerHTML = '<i class="fa fa-chevron-left" aria-hidden="true"></i>';
            buttonNext.innerHTML = '<i class="fa fa-chevron-right" aria-hidden="true"></i>';

            header.appendChild(date);
            header.appendChild(buttonPrev);
            header.appendChild(buttonNext);

            buttonPrev.addEventListener('click', function() {
                self.setMonths(this);
            }, false);
            buttonNext.addEventListener('click', function() {
                self.setMonths(this);
            }, false);

            this.container.appendChild(header);

            this.buttonPrev = buttonPrev;
            this.buttonNext = buttonNext;
            this.date = date;

            // create table
            this.table = document.createElement('table');
            this.table.classList.add('calendar-table');

            this.resetToday();
            
        },
        resetToday : function() {
            this.setHeader(new Date());
            this.createDays(new Date());
        },
        setHeader: function (date) {
            var now = moment(date);
            this.buttonPrev.dataset.next = now.subtract(1, 'month').format('YYYY-MM-DD');
            now.add(1, 'month');
            this.buttonNext.dataset.next = now.add(1, 'month').format('YYYY-MM-DD');
            now.subtract(1, 'month');
            this.date.innerHTML = now.year() + '년 ' + (now.month() + 1) + '월';
        },
        setMonths : function(button) {
            var newDate = button.dataset.next;
            this.setHeader(newDate);
            this.clearDays();
            this.createCalendar(newDate);
        },
        clearDays : function() {
            var tbody = this.container.querySelector('tbody');
            if(tbody) {
                this.table.removeChild(tbody);
            }
        },
        createDays : function() {
            var weeks = ['일','월','화','수','목','금','토'];
            var thead = document.createElement('thead');
            var daysTemplate = '<tr>';
            var n = 0,
                length = weeks.length;
            for(n; n<length; n++) {
                daysTemplate += '<th scope="col">' + weeks[n] + '</th>'
            }
            daysTemplate += '</tr>';
            thead.innerHTML = daysTemplate;
            this.table.appendChild(thead);
            this.container.appendChild(this.table);
            this.createCalendar();
        },
        createCalendar : function(date) {
            var self = this;
            var date = moment(date);
            var now_date = moment();
            var days = date.daysInMonth();
            var firstDay = date.set('date', 1).isoWeekday();
            var skipDays = firstDay;
            var data = { days: [] }
            for (i = 1; i <= days + skipDays; i++) {
                var day = {};
                if (i === 1) day.first = true;
                if (i === days) day.last = true;
                if (((i - 1) % 7) === 0) {
                    day.newWeek = true;
                }
                if (i - skipDays > 0) {
                    day.number = i - skipDays;
                    var date_string = date.format('YYYY-MM-DD');
                    day.date = date_string;
                    if (now_date.isSame(date, 'day')) {
                        day.today = true;
                    }
                    date.add(1, 'day');
                }
                data.days.push(day);
            }
            var isEmptyFirstline = this.isEmptyFirstline(data.days);

            var tbody = document.createElement('tbody');
            var daysTemplate = '<tr>';
            var n = isEmptyFirstline ? 7 : 0,
                length = data.days.length;

            for(n; n<length; n++) {
                var number = data.days[n].number || '';
                var weekClass = '';
                if (data.days[n].today) {
                    weekClass += ' today';
                } else if (data.days[n].newWeek) {
                    weekClass += ' sunday';
                }
                if (data.days[n].newWeek && data.days[n].number != days) {
                    daysTemplate += '</tr>'
                                    + '<tr>';
                } else if (data.days[n].newWeek && data.days[n].number === days) {
                    daysTemplate += '</tr>'
                }
                if (data.days[n].number) {
                    daysTemplate += '<td><button type="button" ' + ((weekClass != '') ? 'class=' + weekClass : '') + ' data-date="' + data.days[n].date + '">' + number + '</button></td>';
                } else {
                    daysTemplate += '<td></td>';
                }
            }
            tbody.innerHTML = daysTemplate;
            this.table.appendChild(tbody);

            tbody.addEventListener('click', function(e) {
                if (e.target && e.target.nodeName === 'BUTTON') {
                    var date = e.target.dataset.date;
                    if (self.clickAfter && typeof self.clickAfter == 'function') {
                        self.clickAfter({
                            date : date
                        })
                    }
                    
                }
            })

        },
        isEmptyFirstline : function(data) {
            var isEmpty = true,
                n = 0;

            for(n; n<7; n++) {
                if (data[n].number) {
                    isEmpty = false;
                    break;
                }
            }
            return isEmpty;
        },
        setAttr: function (element, attr) {
            if (!element) {
                return false;
            }
            for (var idx in attr) {
                if ((idx == 'styles' || idx == 'style') && typeof attr[idx] == 'object') {
                    for (var prop in attr[idx]) {
                        element.style[prop] = attr[idx][prop];
                    }
                } else if (idx == 'html') {
                    element.innerHTML = attr[idx];
                } else {
                    element.setAttribute(idx, attr[idx]);
                }
            }
        },
    }

    return Calendar;

})(window.Calendar || {});