---
layout: ../../layouts/BlogPostLayout.astro
title: "React - useEffectのdependencyで無限ループ"
description: "ESLint が dependency 配列の中にFunctionがないと言うのでFunctionを入れるがBrowser が無限ループしている。"
author: sfujimoto
date: "2022-10-11"
categories: ["js", "HTML", "web", "React", "Next.js"]
slug: react-useeffect

mainImage: "react-useeffect.jpg"
images: []
isFeatured: true
genre: "posts"
---

## Problem

問題は下記のような React Component を作成した時に起こる。
Context を含む Component を作成し、それを`useMyContext()`という名前エクスポートをする。
`MyComponent`という Component で state を表示したい。その際、Context からエクスポートされている`state`という Object と`updateState`という Function を呼び出す。
最新の`state`を表示するため、`useEffect`の中に`updateState`を`state`の変化のたびに更新するようにする。
ESLint が dependency 配列の中に、`updateState`がないと言うので`updateState`を入れる。
しかし、ここで問題が起きる。
挙動を確認すると、Browser が無限ループに入っている。

```ts {1,3,5,7} showLineNumbers title="myComponent.tsx"
// MyComponent.tsx

const { state, updateState } = useMyContext()

useEffect(() => {
  updateState(newState)
}, [updateState, newState, state])
```

原因は`useEffect`が dependency を確認する際、`Object.is(A,B)`で dependency の変化を確認することにある。
Component が re-render される際、function（object も array も同様）は reference が毎回、変化してしまう。つまり、`Object.is(A,B)`で dependency を確認する時に毎回、変化があったと認識されてしまい、無限ループに入ってしまう。

## Solution

この問題を解決するためには２つ（３つ）の方法がある。

1. `useEffect`の中に Context から渡された Function を使わない。
2. Context の中で定義をする時に Function を`useCallback`で囲み、export する時に`useMemo`で囲む。こうすることで、Context の中の Function が同じ reference として保存され、`Object.is(A, B)`の dependency チェックでも変化がないと判断される。



```ts {1-3,7} showLineNumbers title="AppContext.tsx"
// AppContext.tsx
export const AppProvider: FC<ProviderProps> = ({ children }) => {
  // useCallbackでFunctionを囲む
  const _addState = useCallback((newState) => {
    dispatch({
      type: "ADD_STATE",
      payload: {
        newState,
      },
    })
  }, [])

  // useMemoで上記のFunctionを囲む
  const addState = useMemo(() => _addState, [_addState])
  //...
}
```



1. 3 つ目の解決策はまだ現在の React には実装されておらず、まだ RFC の段階である。`useCallback`と`useMemo`を使わなくても`useEvent`という一つの hook だけで全てが解決される。これは[React Docs Beta](https://beta.reactjs.org/learn/separating-events-from-effects#declaring-an-event-function)で使用法を伝えているのでチェックすることをおすすめする。
