import React, { CSSProperties } from 'react';

import './style.css';
// import classNames from 'classnames';


// function getTrueKeys() {}
// 获取值为true的key
function getTrueKeys(obj: Record<string, unknown>): string[] {
  return Object.keys(obj).filter((key) => obj[key]);
}
getTrueKeys({
  'name': true
})
function classNames(...args: string[] | Record<string, boolean>[]) {
  return ' ' + args.reduce((pre, cur) => {
    return pre + (typeof cur === 'string' ? cur : getTrueKeys(cur).join(' '));
  }, '')
}

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
          const lastChildHeight = getNodeHeight(item.children?.length ? item.children[item.children.length - 1] : undefined);
          return (
            <div className="flex" style={{ gap: gapX }} key={item.key}>
              <Card
                style={{
                  '--groupBotton':
                    (lastChildHeight - 1) * (height + gapY) + 'px'
                }  as CSSProperties}
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
                  {firstChild && renderCard([firstChild], false)}
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
        '--h': height + 'px',
        '--gapX': gapX + 'px',
        '--gapY': gapY + 'px',
        '--lineW': gapX / 2 + 'px'
      } as CSSProperties}
    >
      {renderCard([datas], true)}
    </div>
  );
}
