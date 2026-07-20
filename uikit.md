# UIKit 규약

> 상태: 정본(Normative)
>
> 적용 범위: UIKit의 공개 API와 Musecat3-Next의 UIKit 소비 코드

UIKit은 Musecat 제품 기능을 담는 component 모음이 아니라 token 기반 시각 primitive와
범용 interaction surface를 제공하는 design system이다. 공통 소유권 원칙은
[설계 철학](./design-philosophy.md), 경로와 export 형식은
[소스 구조 및 명명 규약](./source-conventions.md), API 설명 형식은
[reference 작성 규약](./reference-conventions.md)을 따른다. 현재 배포본과 이 계약의 차이는
[공유 패키지 이행 문서](./migration/shared-packages.md)에서만 관리한다.

## 소유권

UIKit은 다음을 소유한다.

- `View`, `Pressable`, `ImageView` 같은 시각·상호작용 primitive
- color, spacing, radius, border, shadow, blur, typography, motion token
- focus, keyboard, ARIA, scroll lock을 포함한 범용 접근성 동작
- Dialog, popover, sheet, toast처럼 제품 의미를 모르는 presentation surface
- surface의 portal, layer, responsive presentation, enter/exit animation

UIKit은 다음을 소유하지 않는다.

- 제출 API, domain validation, dirty state, analytics, 성공 후 refresh 정책
- 제품별 title, copy, permission, fallback URL
- Next.js router, pathname, Intercepting Route와 route 유지 정책
- 특정 feature의 state machine이나 store

표현에 필요한 범용 capability가 없으면 애플리케이션에서 CSS나 interaction 복제본을 만들지
않고 UIKit 공개 계약을 확장한다.

## Token과 primitive

- 구조는 `View`, 상호작용은 `Pressable`, 이미지는 `ImageView`를 우선한다. UIKit primitive가
  같은 의미와 접근성 계약을 제공하는데 raw `div`, `button`, `a`, `img`로 우회하지 않는다.
- 색, 간격, radius, border, shadow, blur, typography와 motion은 token 또는 token-aware
  public prop으로 표현한다.
- 계산된 geometry, browser 측정값, 접근성상 필요한 native control처럼 token으로 표현할 수
  없는 값은 허용한다. 이 예외를 component-local design value를 만드는 근거로 사용하지 않는다.
- `radius`가 있는 `View`와 `Pressable`은 `Squircle` rendering path를 유지한다. 직접 CSS
  radius로 바꾸거나 Motion의 width/height animation이 clip-path 계산을 우회하게 만들지 않는다.
- radius scale은 `None`, `ExtraLight`, `Light`, `Regular`, `Bold`, `ExtraBold`, `Heavy`,
  `Circle`이며 방향별 배열에서도 같은 token을 사용할 수 있어야 한다.
- `disabled`와 `readOnly` 상태는 hover/active token 계산에 반영하고, 유효하지 않은 lowercase
  DOM attribute로 전달하지 않는다.

## 공개 API와 style entry

`@musecat/uikit`의 JavaScript/TypeScript 공개 API는 package root의 named export가 기본이다.

```tsx
import {
  Dialog,
  ImageView,
  Pressable,
  Text,
  ThemeBootstrapper,
  View,
} from "@musecat/uikit";
```

- root `index.ts`와 `package.json#exports`는 지원하는 entry를 명시적으로 열거한다.
- `@musecat/uikit/packages/...` deep import와 wildcard subpath export는 금지한다.
- 내부 renderer, hook, helper와 source directory layout은 호환성 계약이 아니다.
- 공개 type은 소비자가 계약을 작성하는 데 필요한 범위만 root에서 named export한다.
- 재사용 source는 named export를 사용한다. framework가 요구하지 않는 default export를 새로
  추가하지 않는다.

전역 style의 유일한 소비자 entry는 `@musecat/uikit/styles`다. 애플리케이션 root에서
정확히 한 번 side-effect import한다.

```ts
import "@musecat/uikit/styles";
```

이 subpath는 `package.json#exports`에 명시되어야 하며 실제 importer SCSS를 가리켜야 한다.
소비자는 `packages/styles/importer` 같은 물리 경로를 알면 안 된다. 현재 release가 이 entry를
제공하는지는 [공유 패키지 이행 문서](./migration/shared-packages.md)에서 확인한다.

## Theme bootstrap

애플리케이션 root에는 `ThemeBootstrapper`를 정확히 한 번 설치한다. 애플리케이션이 별도
theme context나 root attribute updater를 만들지 않는다.

- server layout은 `theme` cookie를 읽고 `light`, `dark`, `system`만 허용한다.
- 검증한 값을 `initialTheme`으로 전달하고 `system`의 실제 light/dark 해석은 hydration 뒤
  UIKit이 수행한다.
- UIKit은 root의 `data-theme`, `data-color-mode`, CSS `color-scheme`, system media query와
  theme persistence를 소유한다.
- 소비자는 `useTheme()`의 `theme`, `setTheme`, `resolvedTheme`을 사용한다.
- `useTheme()`를 provider 밖에서 호출하면 development에서 누락된 bootstrap을 발견할 수
  있는 diagnostic을 제공해야 한다. silent fallback으로 구성 오류를 숨기지 않는다.

server markup에 explicit light/dark attribute를 넣을 때도 UIKit의 validator와 resolution
계약을 사용한다. server와 client가 서로 다른 초기 theme source를 선택해 hydration flash를
만들지 않는다.

## Dialog의 feature와 surface 경계

상태가 있는 기능은 필요할 때 `Root`, `Header`, `Content`, `Actions`를 소유한다. UIKit
Dialog는 이 조각을 modal, sheet 또는 popover에 배치할 뿐 기능 상태를 갱신하지 않는다.

```tsx
<BasicEdit.Root initialData={initialData}>
  <Dialog
    mode="modal"
    mobileMode="sheet"
    open={open}
    onOpenChange={setOpen}
    header={<BasicEdit.Header />}
    footer={<BasicEdit.Actions />}
    onCloseRequest={handleCloseRequest}
    onExitComplete={handleExitComplete}
  >
    <BasicEdit.Content />
  </Dialog>
</BasicEdit.Root>
```

같은 기능은 Dialog 없이 Page surface에서도 같은 state와 validation으로 작동해야 한다.
feature content가 Dialog store ID, renderer 종류 또는 animation duration을 알아야 한다면
소유권이 잘못된 것이다.

### Declarative 우선

폼, 편집기, funnel, 여러 단계 작업은 controlled declarative Dialog를 사용한다.

- `open`과 `onOpenChange`가 논리적 open state의 단일 계약이다.
- `mode`는 필수이며 호출자가 desktop presentation을 명시한다. `mobileMode`가 있으면 UIKit의
  공개 breakpoint 계약이 전환을 수행하고 feature는 별도 viewport 분기를 만들지 않는다.
- `header`, body, `footer`는 현재 React state를 반영하는 slot이다. 최초 config snapshot으로
  고정하거나 imperative updater를 요구하지 않는다.
- top-level `header`와 `footer`는 `ReactNode`를 받는다. convenience config가 필요하면
  `DialogHeader`, `DialogFooter` 같은 명시적 component로 변환하고 한 prop에
  `ReactNode | Config` 해석 규칙을 섞지 않는다.
- modal/sheet responsive 전환은 같은 feature state를 보존하며 close/open lifecycle로
  보고하지 않는다.
- mode별 config에는 해당 presentation의 size, anchor, drag, snap point만 둔다. 공통 slot과
  lifecycle을 mode config마다 복제하지 않는다.

Imperative Dialog는 confirm, alert, 짧은 선택 prompt처럼 일시적이고 state가 작은 UI에만
사용한다. 복잡한 feature form을 store에 넣고 ID 기반 update로 유지하지 않는다.

## 닫기 lifecycle

모든 renderer와 dismiss 수단은 하나의 semantic close-request pipeline을 사용한다.

```text
close request(reason)
  -> close guard
  -> onOpenChange(false)
  -> renderer exit animation
  -> portal/layer cleanup
  -> onExitComplete()
```

공개 close reason은 최소한 `escape`, `outside`, `trigger`, `drag`, `exitButton`, `action`,
`programmatic`을 구분한다. reason union은 공개·versioned 계약이며 renderer가 임의 문자열을
만들지 않는다.

- `onCloseRequest(reason)`은 `boolean | Promise<boolean>`을 반환한다. `false`면 닫지 않는다.
- guard가 throw 또는 reject하면 닫지 않고 해당 오류를 호출 owner가 관찰할 수 있게 한다.
  rejection을 허용으로 해석하거나 unhandled Promise로 버리지 않는다.
- async guard가 pending인 동안 같은 Dialog의 중복 close request를 합친다.
- guard가 허용한 UIKit-originated 요청만 `onOpenChange(false)`를 호출한다. controlled owner가
  직접 `open=false`로 전환하는 것은 강제 state 변경이며 guard를 다시 실행하지 않는다.
- `onExitComplete`는 실제 exit와 portal cleanup이 끝난 뒤 한 close cycle에 정확히 한 번
  호출한다.
- UIKit이 layer·scroll lock·focus restore를 정리한 뒤 `onExitComplete`를 호출하고,
  imperative `closed` Promise는 그 callback 직후 resolve한다.
- closing 중 `open=true`가 되거나 unmount되면 이전 cycle의 stale completion을 취소한다.
- 소비자는 UIKit animation duration을 import하거나 fallback timer로 완료 시점을 추측하지
  않는다.

Dialog context가 close 기능을 노출할 때도 단순 `closeDialog`가 아니라 같은 pipeline을
사용하는 `requestClose(reason)`을 제공한다. 호출자는 reason을 생략하지 않는다. content는
route 이동이나 animation cleanup을
직접 수행하지 않는다.

## Imperative instance

Imperative instance는 선택 결과와 시각적 종료를 구분한다.

```ts
interface DialogInstance<TResult = unknown> {
  id: string;
  result: Promise<TResult | undefined>;
  closed: Promise<void>;
  close(result?: TResult): void;
}
```

- instance 자체를 thenable `Promise`로 만들지 않는다.
- `result`는 사용자 선택 또는 `close(result)` 값을, `closed`는 exit와 cleanup 완료를 뜻한다.
- stack 제거는 hard-coded timeout이 아니라 renderer completion 신호로 수행한다.
- `close`와 completion은 idempotent해야 한다.
- `update`가 필요하면 단순 imperative prompt의 명시적 optional capability로만 추가하며,
  declarative feature state의 대체 수단으로 사용하지 않는다.

## Route 독립성

UIKit source는 `next/navigation`, pathname, fallback URL 또는 Intercepting Route를 import하거나
해석하지 않는다. 애플리케이션의 `RouteModal` adapter가 다음을 소유한다.

- `router.back()`과 fallback navigation
- parallel route slot의 수명
- soft navigation, hard navigation, refresh의 차이
- exit 완료 뒤 navigation을 실행할 정책

route adapter는 완성된 feature Dialog를 lifecycle에 연결하며 `Content`만 다시 조립하지
않는다. 세부 app 경계는 [프론트엔드 규약](./frontend.md)과
[Next.js 규약](./nextjs.md)을 따른다.

## 접근성과 검증

Dialog와 floating surface는 다음을 public behavior로 검증한다.

- focus trap, 최초 focus, nested surface, exit 후 trigger focus restore
- Escape, outside interaction, drag dismiss와 close reason
- semantic role, `aria-modal`, `aria-labelledby`, `aria-describedby`
- body scroll lock과 layer stack의 중첩·정리
- reduced motion, viewport resize, desktop/modal과 mobile/sheet 전환
- guard 거부·실패, 중복 요청, closing 중 reopen, unmount cleanup

public API 변경은 source, type, root export, package export, contract test, fixture, README 예제와
matching reference를 같은 변경에서 갱신한다. build와 typecheck는 실제 browser·접근성 검증을
대체하지 않는다.
