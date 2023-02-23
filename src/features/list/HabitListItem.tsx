/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

type Props = {
  ignoreMouse: boolean;
  name: string;
  streak: number;
  completed: boolean;
  selected: boolean;
  select: () => void;
  toggleCompleted: () => void;
};

export default function HabitListItem({
  ignoreMouse, name, streak, completed, selected, select, toggleCompleted,
}: Props) {
  let containerClassName = 'list-item';
  if (completed) containerClassName += ' complete';
  if (selected) containerClassName += ' selected';

  return (
    <div
      className={containerClassName}
      onClick={toggleCompleted}
      onMouseEnter={ignoreMouse ? undefined : select}
    >
      <div className="list-name">{name}</div>
      <div className="list-streak">{streak}</div>
    </div>
  );
}
