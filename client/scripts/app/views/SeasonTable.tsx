import * as React from 'react';

const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

export interface SeasonTableProps {
    children: React.ReactFragment;
}

export default function SeasonTable({children}: SeasonTableProps): JSX.Element {
    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Sum</th>
                    {weeks.map(toWeekHeading)}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    );
}

function toWeekHeading(week: number): JSX.Element {
    return <th key={week}>{week}</th>;
}
