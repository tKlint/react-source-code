import React, { PropsWithChildren } from 'react'

const datas = [
  {
    key: '1',
    title: '1',
    children: [
      {
        key: '1-1',
        title: '1-1',
        children: [
          {
            key: '1-1-1',
            title: '1-1-1',
          },
          {
            key: '1-1-2',
            title: '1-1-2',
            children: [
              {
                key: '1-1-2-1',
                title: '1-1-2-1',
              },
              {
                key: '1-1-2-2',
                title: '1-1-2-2',
              },{
                key: '1-1-2-3',
                title: '1-1-2-3',
              }
            ]
          }
        ]
      }, {
        key: '1-2',
        title: '1-2',
      }
    ]
  }
]

const gap = 40;
const cardWith = 100;
const cardHeight = 100;

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
}
function Card(props: PropsWithChildren<{
  style?: React.CSSProperties;
  hasParent?: boolean;
  hasChildren?: boolean;
  hasSibling?: boolean;
  hasPreivous?: boolean;
}>) {
  return (
    <div style={{ position: 'relative', paddingRight: gap }}>
      <div style={{ width: cardWith, height: cardHeight, background: randomColor(), ...(props.style || {}) }}>{props.children}</div>
      {props.hasParent && <div style={{ position: 'absolute', top: 20 + cardHeight / 2, left: props.style?.marginLeft - gap / 2, width: gap / 2, height: 1, background: 'red'  }}></div>}
      {props.hasChildren && <div style={{ position: 'absolute', top: 20 + cardHeight / 2, right: 20, width: gap / 2, height: 1, background: 'red'  }}></div>}

      {props.hasSibling && <div style={{
        position: 'absolute',
        top: 20 + cardHeight / 2,
        width: 1,
        height: cardHeight / 2,
        left: props.style?.marginLeft - gap / 2,
        background: 'red'
      }} />}
      {/* {props.hasPreivous && <div style={{
        position: 'absolute',
        top: 0,
        width: 1,
        height: cardHeight / 2,
        left: props.style?.marginLeft - gap / 2,
        background: 'red'
      }} />} */}
      {/* {props.hasChildren && <div style={{ position: 'absolute', width: gap / 2, top: (cardHeight / 2) + +(props.style?.marginTop || 0), right: (gap / 2) + (props.style?.marginLeft || 0), height: 1, background: 'red'  }}></div>} */}
    </div>
  )
}

const getFirstChild = (list: any): any[] => {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    if(i == 0) {
      arr.push(list[i])
    }
    if (list[i].children) {
      arr.push(...getFirstChild(list[i].children))
    }
  }
  return arr;
}

export default function Demo() {
  const renderTree = (list = datas, deep = 0, hasParent = false, isFstChild = true, hasPrevious = false, hasSibling = false) => {
    return list.map((item, idx) => {
      const t = {...item}
      const f = item.children?.shift?.()
      console.log(list, 'vvv', t.children)

      return (
        <div key={item.key} style={{ position: 'relative' }}>
          <div style={{ display: 'flex' }}>
            <Card hasParent={hasParent} hasPreivous={hasPrevious} hasSibling={hasSibling} hasChildren={item.children && item.children.length > 0} style={{ marginLeft: !isFstChild ? (gap + cardWith) * deep : 0, marginTop: 20 }} key={item?.key}>{item?.title}</Card>
            {f && renderTree([f], deep, true, true,false, list.length > 0)}
          </div>
          <div>
            {t.children && renderTree(t.children, deep + 1, true, false, true, t.children.length > 0)}
          </div>
         
        </div>
      )
    })
  }
  return (
    <div>
      {renderTree()}
    </div>
  )
}
