/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

<template>
    <span>
        <slot
            :years="years"
            :days="days"
            :hours="hours"
            :minutes="minutes"
            :seconds="seconds"
        >
            {{years}} years
            {{days}} days
            {{hours}} hours
            {{minutes}} minutes
            {{seconds}} seconds
        </slot>
    </span>
</template>

<script>
import moment from 'moment'

export default {
    name: 'TimeSince',

    props: {
        date: {
            required: true
        }
    },

    data() {
        return {
            interval: null,
            years: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            intervals: {
                second: 1000,
                minute: 1000 * 60,
                hour: 1000 * 60 * 60,
                day: 1000 * 60 * 60 * 24,
                year: 1000 * 60 * 60 * 24 * 365
            }
        }
    },

    mounted() {
        this.interval = setInterval(() => {
            this.updateDateAge()
        }, 1000)
        this.updateDateAge()
    },

    destroyed() {
        clearInterval(this.interval)
    },

    methods: {
        updateDateAge() {
            let now = moment.utc()
            let date = moment(this.date, 'YYYY-MM-DD HH:mm:ss').utc()
            let diff = now.diff(date)
            this.years = Math.floor(diff / this.intervals.year)
            diff -= this.years * this.intervals.year
            this.days = Math.floor(diff / this.intervals.day)
            diff -= this.days * this.intervals.day
            this.hours = Math.floor(diff / this.intervals.hour)
            diff -= this.hours * this.intervals.hour
            this.minutes = Math.floor(diff / this.intervals.minute)
            diff -= this.minutes * this.intervals.minute
            this.seconds = Math.floor(diff / this.intervals.second)
        }
    }
}
</script>
