# -*- coding: utf-8 -*-
import io
p = '/home/hatch/workspace/guppys-guide-dashboard/index.html'
s = io.open(p, encoding='utf-8').read()

def L(*xs):
    return 'L(' + ','.join('"' + x.replace('\\','\\\\').replace('"','\\"') + '"' for x in xs) + ')'

name = L("Qomチェーン DEX","Qom Chain DEX","Qom 链 DEX","Qom 체인 DEX","DEX de la cadena Qom","DEX de la chaîne Qom","Qom-Chain-DEX","DEX da cadeia Qom","DEX сети Qom","منصة Qom اللامركزية","Qom चेन DEX","DEX Rantai Qom")
desc = L(
"Teh Fund の Qom チェーン（EVM 33303、QL1とは別のチェーン）向けの Uniswap V2 方式DEX。WQOMX／Factory／Router02 はチェーン上にデプロイ済みで、チェーン上のコードが配布バイトコードと一致することも検証済み。スワップ・流動性の追加／削除・ラップに対応。Teh Fund の Q ステーブルコインとプールは、彼の側でこれから作られる。",
"A Uniswap V2-style DEX for Teh Fund's Qom chain (EVM 33303 — a separate chain from QL1). WQOMX / Factory / Router02 are deployed on-chain, and the on-chain code was verified to match the shipped bytecode. Supports swaps, adding/removing liquidity and wrapping. Teh Fund's Q stablecoin and its pool come next, on his side.",
"面向 Teh Fund 的 Qom 链（EVM 33303，与 QL1 是不同的链）的 Uniswap V2 风格 DEX。WQOMX／Factory／Router02 已部署到链上，并已验证链上代码与发布的字节码一致。支持兑换、添加／移除流动性和包装。Teh Fund 的 Q 稳定币及其池子将由他后续创建。",
"Teh Fund의 Qom 체인(EVM 33303, QL1과는 별개의 체인)을 위한 Uniswap V2 방식 DEX. WQOMX/Factory/Router02가 온체인에 배포되었고, 온체인 코드가 배포 바이트코드와 일치함을 검증했습니다. 스왑, 유동성 추가/제거, 래핑을 지원합니다. Teh Fund의 Q 스테이블코인과 풀은 그의 측에서 다음에 만들어집니다.",
"Un DEX estilo Uniswap V2 para la cadena Qom de Teh Fund (EVM 33303, una cadena distinta de QL1). WQOMX / Factory / Router02 están desplegados en la cadena y se verificó que el código en cadena coincide con el bytecode publicado. Admite intercambios, añadir/quitar liquidez y wrap. La stablecoin Q de Teh Fund y su pool vienen después, de su lado.",
"Un DEX de type Uniswap V2 pour la chaîne Qom de Teh Fund (EVM 33303 — une chaîne distincte de QL1). WQOMX / Factory / Router02 sont déployés on-chain, et le code on-chain a été vérifié conforme au bytecode publié. Prend en charge les swaps, l'ajout/retrait de liquidité et le wrap. Le stablecoin Q de Teh Fund et son pool viendront ensuite, de son côté.",
"Eine Uniswap-V2-artige DEX für Teh Funds Qom-Chain (EVM 33303 — eine von QL1 getrennte Chain). WQOMX / Factory / Router02 sind on-chain bereitgestellt, und der On-Chain-Code wurde als mit dem ausgelieferten Bytecode übereinstimmend verifiziert. Unterstützt Swaps, Liquidität hinzufügen/entfernen und Wrapping. Teh Funds Q-Stablecoin und sein Pool folgen als Nächstes auf seiner Seite.",
"Uma DEX no estilo Uniswap V2 para a cadeia Qom do Teh Fund (EVM 33303 — uma cadeia separada da QL1). WQOMX / Factory / Router02 estão implantados on-chain, e o código on-chain foi verificado como idêntico ao bytecode publicado. Suporta trocas, adicionar/remover liquidez e wrap. A stablecoin Q do Teh Fund e seu pool virão a seguir, do lado dele.",
"DEX в стиле Uniswap V2 для сети Qom от Teh Fund (EVM 33303 — отдельная сеть от QL1). WQOMX / Factory / Router02 развёрнуты в сети, и ончейн-код проверен на соответствие опубликованному байткоду. Поддерживает обмены, добавление/удаление ликвидности и обёртку. Стейблкоин Q от Teh Fund и его пул появятся позже с его стороны.",
"منصة تداول لامركزية بنمط Uniswap V2 لسلسلة Qom التابعة لـ Teh Fund (EVM 33303 — سلسلة منفصلة عن QL1). تم نشر WQOMX / Factory / Router02 على السلسلة، وتم التحقق من تطابق الكود على السلسلة مع البايت كود المنشور. تدعم المبادلات وإضافة/إزالة السيولة واللف. عملة Q المستقرة من Teh Fund ومجمّعها سيأتيان لاحقًا من جانبه.",
"Teh Fund की Qom चेन (EVM 33303 — QL1 से अलग चेन) के लिए Uniswap V2 शैली की DEX। WQOMX / Factory / Router02 ऑन-चेन तैनात हैं, और ऑन-चेन कोड का प्रकाशित बाइटकोड से मिलान सत्यापित किया गया है। स्वैप, लिक्विडिटी जोड़ना/हटाना और रैप समर्थित है। Teh Fund की Q स्टेबलकॉइन और उसका पूल आगे उनकी ओर से आएगा।",
"DEX bergaya Uniswap V2 untuk rantai Qom milik Teh Fund (EVM 33303 — rantai terpisah dari QL1). WQOMX / Factory / Router02 telah diterapkan on-chain, dan kode on-chain telah diverifikasi cocok dengan bytecode yang diterbitkan. Mendukung swap, menambah/menghapus likuiditas, dan wrap. Stablecoin Q milik Teh Fund dan pool-nya akan menyusul dari pihaknya.")

card = """        {
          name: %s,
          cat: "dex", status: "live",
          desc: %s,
          meta: ["Qom Chain", "EVM 33303"],
          links: [
            { k: "open", url: "https://ql1-infinite42-guppy-histoire.github.io/qom-dex/" },
            { k: "github", url: "https://github.com/QL1-Infinite42-Guppy-Histoire/qom-dex", repo: true }
          ]
        },
""" % (name, desc)

anchor = '          name: L("HAWKバーン"'
i = s.index(anchor)
j = s.rindex('        {\n', 0, i)
s = s[:j] + card + s[j:]

when = L("11月21日","Nov 21, 2026","11月21日","11월 21일","21 nov 2026","21 nov. 2026","21. Nov. 2026","21 nov. 2026","21 нояб. 2026","21 نوفمبر 2026","21 नवंबर 2026","21 Nov 2026")
what = L("Qomチェーン DEX：デプロイ完了・公開","Qom Chain DEX: deployed and published","Qom 链 DEX：已部署并发布","Qom 체인 DEX: 배포 완료·공개","DEX de la cadena Qom: desplegado y publicado","DEX de la chaîne Qom : déployé et publié","Qom-Chain-DEX: bereitgestellt und veröffentlicht","DEX da cadeia Qom: implantado e publicado","DEX сети Qom: развёрнут и опубликован","منصة Qom اللامركزية: تم النشر والإطلاق","Qom चेन DEX: तैनात और प्रकाशित","DEX Rantai Qom: diterapkan dan diterbitkan")
detail = L(
"Teh Fund の Qom チェーン（33303）向け Uniswap V2 方式DEXの3コントラクト（WQOMX／Factory／Router02）を利用者自身のウォレットでデプロイし、チェーン上の実行コードが配布バイトコードと一致することをバイト単位で検証した。サイトを公開し、役目を終えた Deploy タブは撤去した。初回の実プール作成と実スワップは利用者自身のウォレットで行う段階で、Q ステーブルコインとプール、ブリッジは Teh Fund 側の今後の作業。",
"Deployed the three contracts of the Uniswap V2-style DEX for Teh Fund's Qom chain (33303) from the user's own wallet, and verified byte-for-byte that the on-chain runtime code matches the shipped bytecode. The site is published and the one-time Deploy tab has been removed. The first real pool and swap are still done with the user's own wallet; the Q stablecoin, its pool and the bridge follow on Teh Fund's side.",
"用用户自己的钱包在 Teh Fund 的 Qom 链（33303）上部署了 Uniswap V2 风格 DEX 的三个合约（WQOMX／Factory／Router02），并逐字节验证了链上运行时代码与发布的字节码一致。网站已发布，一次性的 Deploy 标签页已移除。首次真实建池和兑换仍由用户用自己的钱包完成；Q 稳定币、其池子和桥将由 Teh Fund 后续跟进。",
"Teh Fund의 Qom 체인(33303)에 Uniswap V2 방식 DEX의 컨트랙트 3개(WQOMX/Factory/Router02)를 이용자 본인의 지갑으로 배포하고, 온체인 런타임 코드가 배포 바이트코드와 바이트 단위로 일치함을 검증했습니다. 사이트를 공개했고, 역할을 마친 Deploy 탭은 제거했습니다. 첫 실제 풀 생성과 스왑은 이용자 본인의 지갑으로 진행하는 단계이며, Q 스테이블코인과 풀, 브리지는 Teh Fund 측의 향후 작업입니다.",
"Se desplegaron los tres contratos de la DEX estilo Uniswap V2 para la cadena Qom de Teh Fund (33303) desde la propia cartera del usuario, y se verificó byte a byte que el código en cadena coincide con el bytecode publicado. El sitio está publicado y la pestaña Deploy, ya innecesaria, fue retirada. El primer pool real y el primer intercambio aún se hacen con la propia cartera del usuario; la stablecoin Q, su pool y el puente seguirán del lado de Teh Fund.",
"Les trois contrats du DEX de type Uniswap V2 pour la chaîne Qom de Teh Fund (33303) ont été déployés depuis le portefeuille de l'utilisateur, et le code on-chain a été vérifié octet par octet conforme au bytecode publié. Le site est publié et l'onglet Deploy, devenu inutile, a été retiré. Le premier pool réel et le premier swap se font encore avec le portefeuille de l'utilisateur ; le stablecoin Q, son pool et le pont suivront du côté de Teh Fund.",
"Die drei Verträge der Uniswap-V2-artigen DEX für Teh Funds Qom-Chain (33303) wurden aus der eigenen Wallet des Nutzers bereitgestellt, und der On-Chain-Code wurde Byte für Byte als mit dem ausgelieferten Bytecode übereinstimmend verifiziert. Die Site ist veröffentlicht, und der einmalige Deploy-Tab wurde entfernt. Der erste echte Pool und Swap erfolgen noch mit der eigenen Wallet des Nutzers; der Q-Stablecoin, sein Pool und die Bridge folgen auf Teh Funds Seite.",
"Os três contratos da DEX estilo Uniswap V2 para a cadeia Qom do Teh Fund (33303) foram implantados a partir da própria carteira do usuário, e o código on-chain foi verificado byte a byte como idêntico ao bytecode publicado. O site está publicado e a aba Deploy, já desnecessária, foi removida. O primeiro pool real e a primeira troca ainda são feitos com a própria carteira do usuário; a stablecoin Q, seu pool e a ponte virão do lado do Teh Fund.",
"Три контракта DEX в стиле Uniswap V2 для сети Qom от Teh Fund (33303) развёрнуты из собственного кошелька пользователя, и ончейн-код побайтно проверен на соответствие опубликованному байткоду. Сайт опубликован, а одноразовая вкладка Deploy удалена. Первый реальный пул и обмен пока выполняются собственным кошельком пользователя; стейблкоин Q, его пул и мост последуют со стороны Teh Fund.",
"تم نشر العقود الثلاثة لمنصة التداول اللامركزية بنمط Uniswap V2 لسلسلة Qom التابعة لـ Teh Fund (33303) من محفظة المستخدم نفسه، وتم التحقق بايتًا ببايت من تطابق الكود على السلسلة مع البايت كود المنشور. الموقع منشور، وأُزيلت علامة Deploy المؤقتة. لا يزال إنشاء أول مجمّع حقيقي وأول مبادلة يتم بمحفظة المستخدم نفسه؛ وستتبعها عملة Q المستقرة ومجمّعها والجسر من جانب Teh Fund.",
"Teh Fund की Qom चेन (33303) के लिए Uniswap V2 शैली DEX के तीनों कॉन्ट्रैक्ट उपयोगकर्ता के अपने वॉलेट से तैनात किए गए, और ऑन-चेन कोड का प्रकाशित बाइटकोड से बाइट-दर-बाइट मिलान सत्यापित किया गया। साइट प्रकाशित है और एकबारगी Deploy टैब हटा दिया गया है। पहला वास्तविक पूल और स्वैप अभी उपयोगकर्ता के अपने वॉलेट से ही होगा; Q स्टेबलकॉइन, उसका पूल और ब्रिज आगे Teh Fund की ओर से आएगा।",
"Tiga kontrak DEX bergaya Uniswap V2 untuk rantai Qom milik Teh Fund (33303) diterapkan dari dompet pengguna sendiri, dan kode on-chain diverifikasi byte demi byte cocok dengan bytecode yang diterbitkan. Situs telah diterbitkan dan tab Deploy sekali pakai telah dihapus. Pool nyata pertama dan swap pertama masih dilakukan dengan dompet pengguna sendiri; stablecoin Q, pool-nya, dan bridge akan menyusul dari pihak Teh Fund.")

check = """        {
          when: %s,
          what: %s,
          detail: %s
        },
""" % (when, what, detail)

k = s.index('      var CHECKS = [\n') + len('      var CHECKS = [\n')
s = s[:k] + check + s[k:]
io.open(p, 'w', encoding='utf-8').write(s)
print('dashboard updated, new size', len(s))
