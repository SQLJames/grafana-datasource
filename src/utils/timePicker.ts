// Copyright (c) 2022 Grafana Labs
// A detailed history of changes can be seen this - https://github.com/VictoriaMetrics/grafana-datasource
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { TimeRange, toUtc, AbsoluteTimeRange } from '@grafana/data';

export const getShiftedTimeRange = (direction: number, origRange: TimeRange): AbsoluteTimeRange => {
  const range = {
    from: toUtc(origRange.from),
    to: toUtc(origRange.to),
  };

  const timespan = (range.to.valueOf() - range.from.valueOf()) / 2;
  let to: number, from: number;

  if (direction === -1) {
    to = range.to.valueOf() - timespan;
    from = range.from.valueOf() - timespan;
  } else if (direction === 1) {
    to = range.to.valueOf() + timespan;
    from = range.from.valueOf() + timespan;
    if (to > Date.now() && range.to.valueOf() < Date.now()) {
      to = Date.now();
      from = range.from.valueOf();
    }
  } else {
    to = range.to.valueOf();
    from = range.from.valueOf();
  }

  return { from, to };
};

export const getZoomedTimeRange = (range: TimeRange, factor: number): AbsoluteTimeRange => {
  const timespan = range.to.valueOf() - range.from.valueOf();
  const center = range.to.valueOf() - timespan / 2;
  // If the timepsan is 0, zooming out would do nothing, so we force a zoom out to 30s
  const newTimespan = timespan === 0 ? 30000 : timespan * factor;

  const to = center + newTimespan / 2;
  const from = center - newTimespan / 2;

  return { from, to };
};
