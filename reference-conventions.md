# API reference 작성 규약

> 상태: 정본(Normative)
>
> 적용 범위: UIKit과 FunctionKit의 `.agents/references/` 및 공개 package API 문서

Reference는 checked-in 구현을 사용하는 방법과 타입만으로 보이지 않는 계약을 설명한다.
별도의 API를 발명하거나 장기 목표를 현재 동작처럼 쓰지 않는다. 장기 설계는
[UIKit 규약](./uikit.md), [FunctionKit 규약](./functionkit.md)과
[설계 철학](./design-philosophy.md), 아직 구현되지 않은 차이는
[공유 패키지 이행 문서](./migration/shared-packages.md)에 둔다. 일반 Markdown 형식은
[작성 및 포맷 규약](./writing-conventions.md)을 따른다.

## 기준 소스

현재 동작을 설명할 때 다음 순서로 확인한다.

1. 구현 source와 public type
2. root `index.ts`와 `package.json#exports`
3. contract test, fixture와 story
4. package README와 reference
5. Git history

Reference와 코드가 다르면 source만 보고 문서를 조용히 덮어쓰지 않는다. 현재 behavior가
장기 규약에 맞으면 reference를 즉시 고치고, 맞지 않으면 current behavior를 정확히 설명한
뒤 migration gap도 별도로 기록한다.

큰 type declaration을 Markdown에 그대로 복사하면 검색은 쉽지만 작은 변경에도 drift한다.
따라서 정확한 source/type/test 링크를 먼저 제공하고, 본문에는 소비자가 판단해야 하는
public signature와 의미만 요약한다. 반대로 source 링크만 있는 한 줄 문서는 default, 오류,
cleanup과 예제를 찾을 수 없으므로 허용하지 않는다.

## Reference index

각 package의 `.agents/references/README.md`가 reference의 유일한 index다. `AGENTS.md`는 index를
가리키고 cross-cutting rule만 요약하며 수동 파일 목록을 다시 복제하지 않는다.

Index는 모든 root public export를 다음 형태로 추적한다. 하나의 cohesive reference가 여러
symbol을 설명할 수 있지만 누락된 symbol이 있어서는 안 된다.

```md
| Public API | 분류 | Runtime | Reference | Source | Tests |
| --- | --- | --- | --- | --- | --- |
| `Example` | Component | Client-only | [`components/Example.md`](./components/Example.md) | [`packages/components/Example.tsx`](../../packages/components/Example.tsx) | [`tests/components/Example.test.tsx`](../../tests/components/Example.test.tsx) |
```

- category directory와 링크의 대소문자는 실제 Git path와 같아야 한다.
- root export를 추가·제거하면 index row도 같은 변경에서 추가·제거한다.
- public export가 없는 internal helper 문서를 index에 public API처럼 올리지 않는다.
- link checker와 export inventory check는 case-sensitive filesystem 기준으로 실행한다.

## 문서 머리말과 필수 링크

각 reference는 H1 바로 아래에 상태, runtime, public import와 근거 링크를 둔다.

```md
# Example

> 상태: Reference
>
> Runtime: Client-only
>
> Public import: `import { Example } from "@musecat/package"`

**Source:** [`packages/components/Example.tsx`](../../../packages/components/Example.tsx)
**Types:** [`packages/components/Example.types.ts`](../../../packages/components/Example.types.ts)
**Root export:** [`index.ts`](../../../index.ts)
**Tests:** [`tests/components/Example.test.tsx`](../../../tests/components/Example.test.tsx)
**Fixture/Story:** [`Example.fixture.tsx`](../../../packages/components/Example.fixture.tsx)
```

- 존재하는 source, type, root export와 test를 개별 상대 링크로 연결한다.
- type 파일이 없거나 fixture가 필요 없는 경우 `해당 없음`과 이유를 짧게 쓴다.
- package root에서 export되지 않는 API는 `Public import`를 만들지 않는다. internal reference임을
  명시하거나 public reference에서 제외한다.
- runtime은 `Universal`, `Client-only`, `Server-only`, `Guarded browser fallback` 중 하나를
  사용한다. 세부 의미는 [FunctionKit 규약](./functionkit.md)을 따른다.

## 내용 순서

모든 reference는 다음 순서로 읽혀야 한다.

1. **목적과 소유권** — 무엇을 해결하고 무엇을 의도적으로 소유하지 않는가
2. **Public API** — root import, 핵심 입력·출력 type과 반환 의미
3. **Runtime과 dependency** — server/client 사용 가능 범위와 필요한 provider/bootstrap
4. **동작 계약** — default, controlled/uncontrolled, state와 lifecycle
5. **접근성** — semantic element, keyboard, focus, ARIA, reduced motion
6. **오류와 cleanup** — throw/reject/fallback, timer/listener/observer/object URL 정리 책임
7. **올바른 예제** — 실제 public import로 실행 가능한 최소 예제
8. **금지 패턴** — 자주 발생하는 deep import, ownership 위반과 잘못된 조합
9. **검증** — contract test, fixture, browser 또는 release artifact 확인 범위

각 항목이 실제로 적용되지 않으면 생략해서 검토 여부를 숨기지 말고 `해당 없음`과 이유를
한 문장으로 쓴다. 여러 단순 pure helper를 한 문서에서 다룰 때는 공통 항목을 한 번 쓰고
symbol별 입력·출력·오류 표를 사용할 수 있다.

### Default와 state

- optional prop의 실제 default와 default를 적용하는 owner를 기록한다.
- controlled와 uncontrolled mode가 모두 있으면 state source, callback 순서와 전환 금지를
  기록한다.
- `null`, 빈 배열, invalid input, disabled/read-only와 hydration 전 상태를 구분한다.
- mode나 responsive presentation 변경이 mount/open lifecycle에 미치는 영향을 설명한다.

### Lifecycle

stateful API는 event 순서와 정확히 한 번 보장되는 callback을 적는다. request, guard,
state transition, visual completion과 cleanup을 하나의 `close`라는 단어로 뭉개지 않는다.
Promise는 resolve 값뿐 아니라 resolve/reject/cancel 시점을 명시한다.

### 접근성

interactive UI는 semantic role, label 관계, keyboard operation, focus 이동·복원과 disabled
behavior를 기록한다. 접근성 동작이 아직 없다면 지원한다고 추정하지 않고 migration gap으로
남긴다.

### 오류와 cleanup

- 함수가 throw, reject, `null`, 빈 값 또는 fallback 중 무엇을 사용하는지 구분한다.
- permission 거부, browser capability 부재와 network/provider 실패를 같은 오류로 합치지 않는다.
- event listener, observer, timer, subscription, scroll lock, portal과 object URL의 생성·해제
  owner를 적는다.
- 소비자가 `cancel`, `unsubscribe`, `revoke`, `close`를 호출해야 하면 예제에서 보여 준다.

## 예제 규칙

- package root 또는 문서화된 explicit subpath만 import한다.
- 필수 `"use client"`, provider, bootstrap, cleanup과 required prop을 생략하지 않는다.
- UIKit 예제는 `View`, `Pressable`, `ImageView`와 token을 사용해 UIKit 자체 규약을 지킨다.
- FunctionKit 예제는 선언한 runtime에서 실제로 실행 가능해야 한다.
- internal file, raw package path, deprecated API와 migration workaround를 정상 예제로 쓰지 않는다.
- 생략된 주변 코드가 있으면 의사 코드라고 표시한다. 완전한 예제처럼 보이는 invalid snippet은
  금지한다.

## 금지 패턴

Reference에 다음을 넣지 않는다.

- source와 다른 손으로 복사한 전체 type declaration
- `@musecat/uikit/packages/...` 또는 `@musecat/functionkit/packages/...` deep import
- UIKit component 문서에서 대체 가능한 raw `div`, `button`, inline design value 사용
- client-only API를 Server Component에서 호출하는 예제
- 구현되지 않은 장기 API를 현재 사용법으로 표현한 예제
- package version, 진행률, 임시 호환 layer처럼 migration에서만 관리할 값
- 실패, accessibility, cleanup이 없는 happy-path 설명만으로 완료 처리

## 같은 변경에서 갱신할 항목

public component, hook, utility, type 또는 behavior를 추가·수정·삭제하면 다음을 하나의 logical
change에서 함께 갱신한다.

1. implementation과 public type
2. root barrel과 explicit package export
3. contract test와 필요한 fixture/story
4. matching reference와 reference index
5. package README의 대표 예제 또는 dependency acknowledgement
6. breaking change의 migration 항목과 release note

테스트 뒤에 문서를 미루지 않는다. 구현과 type을 바꾸는 batch에서 reference contract도 먼저
맞추고, 최종 검증에서 source link, public import, example typecheck와 case-sensitive link를
확인한다.

## Reference template

```md
# PublicSymbol

> 상태: Reference
>
> Runtime: Universal | Client-only | Server-only | Guarded browser fallback
>
> Public import: `import { PublicSymbol } from "@musecat/package"`

**Source:** [source link]
**Types:** [type link 또는 해당 없음]
**Root export:** [index.ts link]
**Tests:** [contract test link]
**Fixture/Story:** [link 또는 해당 없음]

## 목적과 소유권

[해결하는 문제, owner, 소유하지 않는 정책]

## Public API

[핵심 signature, 입력과 반환 의미]

## Runtime과 dependency

[runtime 제한, provider/bootstrap, import graph]

## 동작 계약

[default, state, lifecycle, concurrency]

## 접근성

[semantic role, keyboard, focus, ARIA 또는 해당 없음]

## 오류와 cleanup

[오류 model, fallback, 해제 owner 또는 해당 없음]

## 예제

[public API만 사용하는 실행 가능한 최소 예제]

## 금지 패턴

[deep import, ownership 위반, 잘못된 조합]

## 검증

[unit/contract/browser/fixture/package 검증]
```
