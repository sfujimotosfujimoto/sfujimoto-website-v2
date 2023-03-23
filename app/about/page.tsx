import Image from "next/image"

import sfujimotoPic from "../../public/images/sfujimoto.png"

export default function AboutPage() {
  return (
    <section aria-label="About Me" className="grid place-content-center">
      <div className="relative grid h-32 place-content-center">
        <Image
          src={sfujimotoPic}
          alt="sfujimoto"
          fill
          className="object-contain"
        />
      </div>

      <div>
        <h1 className="text-4xl">About</h1>
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
        quidem repellendus praesentium soluta amet id ipsam dicta, provident
        impedit earum molestias nostrum, pariatur consequuntur tempora ducimus
        aperiam cumque consectetur recusandae velit similique dolorem eligendi
        sed ex totam? Eaque, sed doloribus! Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Possimus veritatis expedita laudantium
        quae quas. Magnam at doloribus voluptas laborum id cumque nulla adipisci
        laudantium voluptatibus unde, magni vero nostrum dignissimos? Earum
        consectetur fuga illum voluptatibus, voluptatem distinctio in magni?
        Commodi voluptatem vel et aperiam. Odio necessitatibus itaque doloribus
        vero placeat maxime, maiores consequuntur, sunt error blanditiis
        reprehenderit minima dolorum eaque. Fugiat at quis, similique
        perspiciatis, eveniet placeat eius porro, dicta laudantium cum eos
        labore cumque corrupti ullam reiciendis? Ratione illo fuga dolor,
        dolorum eos expedita eligendi mollitia repellat dolores ipsam.
        Asperiores dolor perferendis itaque omnis, dolores eveniet quis maxime
        sit possimus exercitationem aliquid nesciunt dolorum id atque tempora
        ipsam delectus ad minus nobis. Quod sapiente consectetur nesciunt?
        Labore, inventore nobis? Ut unde eum minima, harum libero voluptate
        numquam excepturi delectus nemo voluptatibus iusto vel impedit
        praesentium odio vitae natus ducimus necessitatibus consectetur nam quam
        consequuntur! Excepturi deserunt beatae veritatis consequuntur? Quidem
        recusandae cumque doloremque necessitatibus nisi ducimus ratione
        voluptatem veniam autem nulla praesentium ipsum ipsa, tempora, dolores
        qui et, atque sequi! Sit quidem veritatis vitae dolor! Voluptatem
        tenetur sit sed! Error culpa rerum libero dolores, explicabo, ipsa eos,
        alias tempore consequuntur officia quo nobis iure. Blanditiis ea libero
        eveniet maxime ducimus odio quas fuga! Doloribus ex culpa molestiae
        temporibus libero? Ea unde maxime culpa laboriosam. Impedit, vero
        quisquam a asperiores debitis voluptatum dolorem? Ipsa enim, omnis
        dolorem porro vitae unde qui asperiores quae eaque nesciunt quia debitis
        sint quibusdam. Ipsa? Quo illo nulla aut aliquid ea at! Nesciunt, earum!
        Mollitia dolore, harum ipsa vitae sequi error ipsam necessitatibus ad
        non delectus sit modi. Voluptas officia beatae corporis pariatur facere
        natus. Error rerum soluta amet magnam, quia cupiditate voluptatibus,
        quas at dolorem doloremque quibusdam earum quam, natus maiores
        dignissimos id modi laborum. Quo nostrum ad pariatur vel non vero quas
        animi. Dolorum repellat illum quasi blanditiis necessitatibus labore
        temporibus officiis alias quo, aliquam corrupti molestias assumenda
        animi accusantium ipsa saepe, earum eaque ipsum. Earum quaerat excepturi
        magni necessitatibus assumenda numquam incidunt. Aut, alias repudiandae!
      </p>

      <a href="mailto:sfujimotosfujimoto@gmail.com">Contact Me</a>
    </section>
  )
}
