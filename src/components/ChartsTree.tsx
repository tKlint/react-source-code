import React from 'react';

import './style.less';
import classNames from 'classnames';

type Data = {
  key: string;
  children?: Data[];
};

const datas: Data = {
  key: '1',
  children: [
    {
      key: '1-1',
      children: [
        {
          key: '1-1-1',
          children: [
            {
              key: '1-1-1-1'
            },
            {
              key: '1-1-1-2'
            }
          ]
        },
        {
          key: '1-1-2'
        }
      ]
    },
    {
      key: '1-2',
      children: [
        {
          key: '1-2-1'
        },
        {
          key: '1-2-2'
        },
        {
          key: '1-2-3'
        },
        {
          key: '1-2-4'
        }
      ]
    },
    {
      key: '1-3',
      children: [
        {
          key: '1-3-1'
        },
        {
          key: '1-3-2'
        },
        {
          key: '1-3-3'
        },
        {
          key: '1-3-4'
        }
      ]
    }
  ]
};

const randomColor = () => {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
};

function Card(props: {
  msg: string;
  style?: React.CSSProperties;
  className?: string;
  wrapClass?: string;
}) {
  const { msg, className = '', wrapClass = '', style = {} } = props;

  return (
    <div
      className={classNames('rounded groupWrap', wrapClass)}
      style={{
        ...style
      }}
    >
      <div
        className={`flex flex-col justify-between items-center rounded card-container ${className}`}
        style={{
          background: randomColor()
        }}
      >
        <p className="p-6">{msg}</p>
      </div>
    </div>
  );
}

function getNodeHeight(node?: Data, int = 0) {
  if (!node) {
    return int;
  }
  if (!node.children || node.children.length === 0) {
    return 1 + int;
  }

  for (let index = 0; index < node.children.length; index++) {
    const element = node.children[index];
    int += getNodeHeight(element);
  }

  return int;
}

export default function Test() {
  const gapX = 30;
  const gapY = 30;
  const height = 80;
  const renderCard = (items: Data[], isRoot = false) => {
    if (!items || items.length === 0) return null;
    return (
      <div
        className="card-wrap flex flex-col"
        style={{
          gap: gapY
        }}
      >
        {items.map((item) => {
          const children = [...(item.children || [])];
          const firstChild = children?.shift();
          const hasChild = !!firstChild;
          const lastChildHeight = getNodeHeight(item.children?.at(-1));
          return (
            <div className="flex" style={{ gap: gapX }} key={item.key}>
              <Card
                style={{
                  // @ts-ignore
                  '--groupBotton':
                    (lastChildHeight - 1) * (height + gapY) + 'px'
                }}
                msg={`${item.key}`}
                className={classNames({ hasChild, hasParent: !isRoot })}
                wrapClass={classNames({
                  'group-wrap-has-children': hasChild
                })}
              />
              {(firstChild || children) && (
                <div
                  className="flex flex-col sibling-group"
                  style={{ gap: gapY }}
                >
                  {firstChild && renderCard([firstChild as any], false)}
                  {children && renderCard(children, false)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div
      className="p-6"
      style={{
        // @ts-ignore
        '--h': height + 'px',
        '--gapX': gapX + 'px',
        '--gapY': gapY + 'px',
        '--lineW': gapX / 2 + 'px'
      }}
    >
      {renderCard([datas], true)}
    </div>
  );
}
